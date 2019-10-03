interface ISettings {
  string_setting: string;
  boolean_setting: boolean;
}

export function updateSettings(oldSettings: ISettings) {
  return function<K extends keyof ISettings>(name: K, value: ISettings[K]) {
    let newSettings: ISettings = { ...oldSettings };
    newSettings[name] = value;
    return newSettings;
  };
}

function main() {
  const settings = {
    string_setting: "foo",
    boolean_setting: false
  };
  const updateFunc = updateSettings(settings);
  const result = updateFunc("string_setting", "sdd");
  //const resul2 = updateFunc("string_setting", true);
}
