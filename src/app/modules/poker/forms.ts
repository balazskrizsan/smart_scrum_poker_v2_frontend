import {Injectable} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {IPoker}                             from './interfaces/i-poker';

@Injectable()
export class Forms {
  private CruFields: any = {
    id: new FormControl(null, []),
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    ticketNames: new FormArray([]),
  };

  newTicketName(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5)])
    })
  }

  getFields(): any {
    return this.CruFields;
  }

  createCruForm(): FormGroup {
    return new FormGroup(
      {
        id: this.CruFields.id,
        name: this.CruFields.name,
        ticketNames: this.CruFields.ticketNames,
      }
    );
  }

  getFieldValue(field: string): string {
    return this.getField(field).value;
  }

  getField(field: string): FormControl {
    return this.CruFields[field];
  }

  getArrayField(field: string): FormArray {
    return this.CruFields[field];
  }

  private ConfigFields: any = {
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    sizesConfig: new FormArray([]),
    dimensionsConfig: new FormArray([]),
    pointsMapping: new FormArray([]),
  };

  newSizeConfig(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      value: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
  }

  newDimensionConfig(sizeConfig: any[]): FormGroup {
    const sizeValues = new FormArray([]);
    for (const size of sizeConfig) {
      sizeValues.push(new FormGroup({
        value: new FormControl(size.value),
      }));
    }
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      sizeValues: sizeValues,
    });
  }

  newPointsMapping(): FormGroup {
    return new FormGroup({
      totalRangeMin: new FormControl(0, [Validators.required, Validators.min(0)]),
      totalRangeMax: new FormControl(0, [Validators.required, Validators.min(0)]),
      points: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
  }

  createConfigForm(): FormGroup {
    return new FormGroup({
      name: this.ConfigFields.name,
      sizesConfig: this.ConfigFields.sizesConfig,
      dimensionsConfig: this.ConfigFields.dimensionsConfig,
      pointsMapping: this.ConfigFields.pointsMapping,
    });
  }

  getSizesConfigField(): FormArray {
    return this.ConfigFields.sizesConfig;
  }

  getDimensionsConfigField(): FormArray {
    return this.ConfigFields.dimensionsConfig;
  }

  getPointsMappingField(): FormArray {
    return this.ConfigFields.pointsMapping;
  }

  getSizeValuesField(dimensionIndex: number, form: FormGroup): FormArray {
    return (form.get('dimensionsConfig') as FormArray).at(dimensionIndex).get('sizeValues') as FormArray;
  }
}
