import { FieldError } from 'react-hook-form';
import { regexConstant } from '../core/constants/regex.constant';

/** 自定義驗證器 mapping 錯誤訊息 */
export const errorMessages = {
  // Email
  emailRequire: '請輸入電子信箱',
  emailInvalid: '請輸入有效的電子信箱',
  // 姓名
  nameRequire: '請輸入姓名',
  // 聯絡電話
  telRequire: '請輸入聯絡電話',
  telInvalid: '請輸入有效的聯絡電話',
  // 地址
  addressRequire: '請輸入收件地址',
};

/** 表單驗證服務 */
export class ValidationService {
  /**
   * 取得 Email 驗證規則
   *
   * @returns rules
   */
  static emailValidator() {
    return {
      required: errorMessages.emailRequire,
      pattern: {
        value: regexConstant.email,
        message: errorMessages.emailInvalid,
      },
    };
  }

  /**
   * 取得姓名驗證規則
   *
   * @returns rules
   */
  static nameValidator() {
    return {
      required: errorMessages.nameRequire,
    };
  }

  /**
   * 取得聯絡電話驗證規則
   *
   * @returns rules
   */
  static telValidator() {
    return {
      required: errorMessages.telRequire,
      minLength: {
        value: 8,
        message: errorMessages.telInvalid,
      },
    };
  }

  /**
   * 取得收件地址驗證規則
   *
   * @returns rules
   */
  static addressValidator() {
    return {
      required: errorMessages.addressRequire,
    };
  }

  /**
   * 取得錯誤訊息
   *
   * @param errors - FieldError
   * @returns 錯誤訊息
   */
  static getHelperText(errors?: FieldError): string {
    if (errors) {
      return errors.message as string;
    } else {
      return ' ';
    }
  }

  /**
   * 驗證輸入格式
   *
   * @param e - ChangeEvent
   * @returns 是否通過輸入格式驗證
   */
  static isValidInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): boolean {
    const { name, value } = e.target;

    switch (name) {
      case 'email':
        return /^[0-9a-zA-Z.@%_-]*$/.test(value);
      case 'tel':
        return /^\d{0,10}$/.test(value);
      default:
        return true;
    }
  }
}

export default ValidationService;
