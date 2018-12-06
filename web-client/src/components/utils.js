export class LabelValuePairs {
  constructor() {
    this.labels = [];
    this.values = [];
  }

  getLabels() { return this.labels; }

  getValues() { return this.values; }

  push(label, value) {
    this.labels.push(label);
    this.values.push(value);
  }
}
