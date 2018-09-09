export class BleDevice {
  public readonly mac: string;
  public readonly name: string;

  constructor(rawPkg: string) {
    try {
      const data = rawPkg.split('Device')[1].trim();
      const arr = data.split(' ');
      this.mac = arr[0];
      this.name = '';
      for (let i = 1; i < arr.length; i++) {
        if (i !== arr.length - 1) {
          this.name += arr[i] + ' ';
        } else {
          this.name += arr[i];
        }
      }
    } catch (e) {
      console.error(`Convert to BleDevice error! Info: ${e}`);
    }
  }
}
