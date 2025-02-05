/** 正規表達式常數型別 */
export interface RegexConstant {
  [key: string]: RegExp;
}

/** 正規表達式 - 常數 */
export const regexConstant: RegexConstant = {
  /** 電子信箱 */
  email: /^([0-9a-zA-Z._%-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,4})*$/,
};
