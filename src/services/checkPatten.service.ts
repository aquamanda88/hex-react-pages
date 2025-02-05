import { ChangeEvent } from "react";

/** 檢查輸入格式服務 */
export class CheckPattenService {
  /**
   * 輸入值格式驗證
   *
   * @param inputRegex - 使用的正規表達式
   * @param e - ChangeEvent
   * @returns 是否通過格式驗證
   */
  checkPatten(inputRegex: string, e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): boolean {
    /** 檢查用正規表達式 */
    const regExp = new RegExp(inputRegex);
    /** 是否通過格式驗證 */
    const isAllowedPatten = regExp.test(String(e.target.value));
    return isAllowedPatten;
  }
}

export default new CheckPattenService();
