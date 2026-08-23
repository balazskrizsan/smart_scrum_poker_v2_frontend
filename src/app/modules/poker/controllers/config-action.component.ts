import {
    Component,
    OnDestroy,
    OnInit
}                              from '@angular/core';
import {Title}                 from "@angular/platform-browser";
import {Forms}                 from '../forms';
import {
    FormArray,
    FormControl,
    FormGroup,
    ReactiveFormsModule
}                              from "@angular/forms";
import {RxStompService}        from "../../commons/services/rx-stomp-service";
import {SocketDestination}     from "../../commons/enums/socket-destination";
import {RouterNavigateService} from "../service/router-navigate-service";
import {CommonModule}          from "@angular/common";
import {LoggingService}        from "../../../services/logging.service";
import {LoggingGroup}          from "../../../services/enums/logging-group";

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

    public constructor(
      protected forms: Forms,
      private rxStompService: RxStompService,
      private routerNavigateService: RouterNavigateService,
      private titleService: Title
    )
    {
        this.form = this.forms.createConfigForm();
    }

    ngOnInit(): void
    {
        this.titleService.setTitle(this.pageTitle);
    }

    ngOnDestroy(): void
    {
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

    getSizeNameFromConfig(sizeIndex: number): string
    {
        if (!this.sizesConfig || sizeIndex >= this.sizesConfig.length) {
            return 'Size ' + (sizeIndex + 1);
        }
        const size = (this.sizesConfig.at(sizeIndex) as FormGroup);
        return size?.get('name')?.value || 'Size ' + (sizeIndex + 1);
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

        const sizeValues = sizes.map((s: any) => s.value);
        const sizeNames = sizes.map((s: any) => s.name);

        const combinations: any[] = [];
        const maxCombinations = 20;

        // Generate all possible combinations
        const generate = (current: number[], index: number) => {
            if (index === dimensions.length) {
                const total = current.reduce((sum, val) => sum + val, 0);
                const points = this.calculatePointsForCombination(current);
                const sizeLabels = current.map((val) => {
                    const sizeIndex = sizeValues.indexOf(val);
                    return sizeNames[sizeIndex] || val;
                });

                combinations.push({
                    dimensions: sizeLabels,
                    total: total,
                    points: points
                });
                return;
            }

            for (const value of sizeValues) {
                current.push(value);
                generate(current, index + 1);
                current.pop();
                if (combinations.length >= maxCombinations) {
                    return;
                }
            }
        };

        generate([], 0);
        return combinations.slice(0, maxCombinations);
    }

    get pointsPreview(): any[]
    {
        try {
            return this.generateCombinations();
        } catch (error) {
            console.error('Error generating points preview:', error);
            return [];
        }
    }

    addSizeConfig()
    {
        this.sizesConfig.push(this.forms.newSizeConfig());
        this.updateDimensionsSizeValues();
    }

    removeSizeConfig(index: number)
    {
        this.sizesConfig.removeAt(index);
        this.updateDimensionsSizeValues();
    }

    updateDimensionsSizeValues()
    {
        const sizeConfig = this.sizesConfig.getRawValue();
        for (let i = 0; i < this.dimensionsConfig.length; i++) {
            const dimension = (this.dimensionsConfig.at(i) as FormGroup);
            const sizeValues = dimension.get('sizeValues') as FormArray;
            sizeValues.clear();
            for (const size of sizeConfig) {
              sizeValues.push(new FormGroup({
                value: new FormControl(size.value),
              }));
            }
        }
    }

    addDimensionConfig()
    {
        const sizeConfig = this.sizesConfig.getRawValue();
        const dimension = this.forms.newDimensionConfig(sizeConfig);
        this.dimensionsConfig.push(dimension);
    }

    removeDimensionConfig(index: number)
    {
        this.dimensionsConfig.removeAt(index);
    }

    addPointsMapping()
    {
        this.pointsMapping.push(this.forms.newPointsMapping());
    }

    removePointsMapping(index: number)
    {
        this.pointsMapping.removeAt(index);
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
                    name: size.name,
                    value: size.value
                })),
                dimensionsConfig: formValue.dimensionsConfig.map((dimension: any) => ({
                    name: dimension.name,
                    sizeValues: dimension.sizeValues.reduce((acc: any, sv: any, index: number) => {
                        const sizeName = formValue.sizesConfig[index].name;
                        acc[sizeName] = sv.value;
                        return acc;
                    }, {})
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
