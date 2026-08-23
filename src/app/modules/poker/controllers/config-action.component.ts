import {
    Component,
    OnDestroy,
    OnInit
}                              from '@angular/core';
import {ChangeDetectorRef}     from '@angular/core';
import {Title}                 from "@angular/platform-browser";
import {Forms}                 from '../forms';
import {
    FormArray,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
}                              from "@angular/forms";
import {RxStompService}        from "../../commons/services/rx-stomp-service";
import {SocketDestination}     from "../../commons/enums/socket-destination";
import {RouterNavigateService} from "../service/router-navigate-service";
import {CommonModule}          from "@angular/common";
import {LoggingService}        from "../../../services/logging.service";
import {LoggingGroup}          from "../../../services/enums/logging-group";
import {Subject}               from 'rxjs';
import {takeUntil}             from 'rxjs/operators';

@Component(
  {
      templateUrl: '../views/config.html',
      standalone:  true,
      imports:     [CommonModule, ReactiveFormsModule],
      styleUrls:   [],
      providers:   [Forms, RouterNavigateService],
  }
)
export class ConfigActionComponent implements OnDestroy, OnInit
{
    public pageTitle = 'Poker Configuration - Smart Scrum Poker';
    protected form: FormGroup;
    private log = new LoggingService().setGroups(LoggingGroup.POKER);
    private hasSubmit = false;
    private destroy$ = new Subject<void>();
    private _pointsPreview: any[] = [];
    public showPointsPreview = false;
    private readonly MAX_PREVIEW_ROWS = 50;
    private readonly MAX_ROWS_PER_POINTS = 3;

    public constructor(
      protected forms: Forms,
      private rxStompService: RxStompService,
      private routerNavigateService: RouterNavigateService,
      private titleService: Title,
      private cdr: ChangeDetectorRef
    )
    {
        this.form = this.forms.createConfigForm();
    }

    ngOnInit(): void
    {
        this.titleService.setTitle(this.pageTitle);

        // Subscribe to form value changes to regenerate points preview
        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this._pointsPreview = this.generateCombinations();
            this.cdr.detectChanges();
        });
    }

    ngOnDestroy(): void
    {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get sizesConfig(): FormArray
    {
        return this.form?.get("sizesConfig") as FormArray
    }

    get dimensionsConfig(): FormArray
    {
        return this.form?.get("dimensionsConfig") as FormArray
    }

    get pointsMapping(): FormArray
    {
        return this.form?.get("pointsMapping") as FormArray
    }

    getSizeValuesField(dimensionIndex: number): FormArray
    {
        if (!this.dimensionsConfig || dimensionIndex >= this.dimensionsConfig.length) {
            return new FormArray([]);
        }
        const dimension = (this.dimensionsConfig.at(dimensionIndex) as FormGroup);
        return dimension?.get('sizeValues') as FormArray || new FormArray([]);
    }

    getDimensionName(dimensionIndex: number): string
    {
        if (!this.dimensionsConfig || dimensionIndex >= this.dimensionsConfig.length) {
            return 'Dimension ' + (dimensionIndex + 1);
        }
        const dimension = (this.dimensionsConfig.at(dimensionIndex) as FormGroup);
        return dimension?.get('name')?.value || 'Dimension ' + (dimensionIndex + 1);
    }

    getSizeValueName(dimensionIndex: number, sizeValueIndex: number): string
    {
        const sizeValues = this.getSizeValuesField(dimensionIndex);
        if (!sizeValues || sizeValueIndex >= sizeValues.length) {
            return 'Size ' + (sizeValueIndex + 1);
        }
        const sizeValue = (sizeValues.at(sizeValueIndex) as FormGroup);
        return sizeValue?.get('name')?.value || 'Size ' + (sizeValueIndex + 1);
    }

    calculatePointsForCombination(combination: number[]): number
    {
        const total = combination.reduce((sum, val) => sum + val, 0);
        if (!this.pointsMapping || this.pointsMapping.length === 0) {
            return 0;
        }
        const mapping = this.pointsMapping.getRawValue();
        if (!mapping || mapping.length === 0) {
            return 0;
        }
        for (const m of mapping) {
            if (total >= m.totalRangeMin && total <= m.totalRangeMax) {
                return m.points;
            }
        }
        return 0;
    }

    generateCombinations(): any[]
    {
        if (!this.sizesConfig || !this.dimensionsConfig || this.sizesConfig.length === 0 || this.dimensionsConfig.length === 0) {
            return [];
        }

        const sizes = this.sizesConfig.getRawValue();
        const dimensions = this.dimensionsConfig.getRawValue();
        if (!sizes || !dimensions || sizes.length === 0 || dimensions.length === 0) {
            return [];
        }

        // Check if all dimensions have size values
        for (const dim of dimensions) {
            if (!dim.sizeValues || dim.sizeValues.length === 0) {
                return [];
            }
        }

        const combinations: any[] = [];

        // Generate all possible combinations using dimension size values
        const generate = (currentNames: string[], currentValues: number[], index: number) => {
            if (index === dimensions.length) {
                const total = currentValues.reduce((sum, val) => sum + val, 0);
                const points = this.calculatePointsForCombination(currentValues);

                // Create labels with values in parentheses
                const dimensionLabels = currentNames.map((name, i) => `${name} (${currentValues[i]})`);
                combinations.push({
                    dimensions: dimensionLabels,
                    total: total,
                    points: points
                });
                return;
            }

            const dimensionSizeValues = dimensions[index].sizeValues;
            for (const sizeValue of dimensionSizeValues) {
                currentNames.push(sizeValue.name);
                currentValues.push(sizeValue.value);
                generate(currentNames, currentValues, index + 1);
                currentNames.pop();
                currentValues.pop();
            }
        };

        generate([], [], 0);

        // Group combinations by points
        const groupedByPoints = new Map<number, any[]>();
        for (const combo of combinations) {
            if (!groupedByPoints.has(combo.points)) {
                groupedByPoints.set(combo.points, []);
            }
            groupedByPoints.get(combo.points)!.push(combo);
        }

        // For each points value, randomly select up to MAX_ROWS_PER_POINTS combinations
        const filtered: any[] = [];
        const uniquePoints = Array.from(groupedByPoints.keys()).sort((a, b) => b - a);

        for (const points of uniquePoints) {
            const pointsCombinations = groupedByPoints.get(points)!;

            // Shuffle this group randomly
            for (let i = pointsCombinations.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pointsCombinations[i], pointsCombinations[j]] = [pointsCombinations[j], pointsCombinations[i]];
            }

            // Sort by total descending
            pointsCombinations.sort((a, b) => b.total - a.total);

            // Select up to MAX_ROWS_PER_POINTS
            const count = Math.min(this.MAX_ROWS_PER_POINTS, pointsCombinations.length);
            for (let i = 0; i < count; i++) {
                filtered.push(pointsCombinations[i]);
            }

            if (filtered.length >= this.MAX_PREVIEW_ROWS) {
                break;
            }
        }

        return filtered;
    }

    get pointsPreview(): any[]
    {
        return this._pointsPreview;
    }

    regeneratePointsPreview()
    {
        this._pointsPreview = this.generateCombinations();
        this.showPointsPreview = true;
        this.cdr.detectChanges();
    }

    addSizeConfig()
    {
        this.sizesConfig.push(this.forms.newSizeConfig());
        this.updateDimensionsSizeValues();
        this.cdr.detectChanges();
    }

    removeSizeConfig(index: number)
    {
        this.sizesConfig.removeAt(index);
        this.updateDimensionsSizeValues();
        this.cdr.detectChanges();
    }

    updateDimensionsSizeValues()
    {
        const sizeConfig = this.sizesConfig.getRawValue();
        for (let i = 0; i < this.dimensionsConfig.length; i++) {
            const dimension = (this.dimensionsConfig.at(i) as FormGroup);
            const sizeValues = dimension.get('sizeValues') as FormArray;
            const currentValues = sizeValues.getRawValue();

            sizeValues.clear();
            for (const size of sizeConfig) {
                // Preserve existing value if size name matches
                const existing = currentValues.find((cv: any) => cv.name === size.name);
                const value = existing ? existing.value : 1;
                sizeValues.push(new FormGroup({
                    name: new FormControl(size.name),
                    value: new FormControl(value, [Validators.required, Validators.min(1)]),
                }));
            }
        }
    }

    addDimensionConfig()
    {
        const sizeConfig = this.sizesConfig.getRawValue();
        const dimension = this.forms.newDimensionConfig(sizeConfig);
        this.dimensionsConfig.push(dimension);
        this.cdr.detectChanges();
    }

    removeDimensionConfig(index: number)
    {
        this.dimensionsConfig.removeAt(index);
        this.cdr.detectChanges();
    }

    addPointsMapping()
    {
        this.pointsMapping.push(this.forms.newPointsMapping());
        this.cdr.detectChanges();
    }

    removePointsMapping(index: number)
    {
        this.pointsMapping.removeAt(index);
        this.cdr.detectChanges();
    }

    public hasValidationError(fieldName: string): boolean
    {
        const field = this.form.get(fieldName);

        return field.invalid && (field.touched || this.hasSubmit);
    }

    public hasArrayValidationError(fieldName: string, index: number): boolean
    {
        const field = (this.form.get(fieldName) as FormArray).at(index);

        return field.invalid && (field.touched || this.hasSubmit);
    }

    onSubmit()
    {
        this.hasSubmit = true;
        if (this.form.valid)
        {
            this.log.info("Create poker config", this.form.getRawValue());

            const formValue = this.form.getRawValue();

            const configData = {
                name: formValue.name,
                sizesConfig: formValue.sizesConfig.map((size: any) => ({
                    name: size.name
                })),
                dimensionsConfig: formValue.dimensionsConfig.map((dimension: any) => ({
                    name: dimension.name,
                    sizeValues: dimension.sizeValues.map((sv: any) => ({
                        name: sv.name,
                        value: sv.value
                    }))
                })),
                pointsMapping: formValue.pointsMapping.map((mapping: any) => ({
                    totalRange: [mapping.totalRangeMin, mapping.totalRangeMax],
                    points: mapping.points
                }))
            };

            this.rxStompService.publish(
              SocketDestination.SEND_POKER_CONFIG_CREATE,
              configData
            );
        }
    }
}
