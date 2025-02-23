import { FieldError } from 'react-hook-form';
import { regexConstant } from '../core/constants/regex.constant';

/** 自定義驗證器 mapping 錯誤訊息 */
export const errorMessages = {
  // Email
  emailRequire: '請輸入電子信箱',
  emailInvalid: '請輸入有效的電子信箱',
  // 密碼
  whisperRequire: '請輸入密碼',
  // 作品名稱
  titleRequire: '請輸入作品名稱',
  // 分類
  categoryRequire: '請輸入分類',
  // 單位
  unitRequire: '請輸入單位',
  // 原價
  originPriceRequire: '請輸入原價',
  originPriceInvalid: '原價不可為 0',
  // 售價
  priceRequire: '請輸入售價',
  priceInvalid: '售價不可為 0',
  // 姓名
  nameRequire: '請輸入姓名',
  // 聯絡電話
  telRequire: '請輸入聯絡電話',
  telInvalid: '請輸入有效的聯絡電話',
  // 地址
  addressRequire: '請輸入收件地址',
  // 優惠券代碼
  couponTitleRequire: '請輸入優惠券名稱',
  // 優惠券代碼
  couponCodeRequire: '請輸入優惠券代碼',
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
   * 取得密碼驗證規則
   *
   * @returns rules
   */
  static passwordValidator() {
    return {
      required: errorMessages.whisperRequire,
    };
  }

  /**
   * 取得作品名稱驗證規則
   *
   * @returns rules
   */
  static titleValidator() {
    return {
      required: errorMessages.titleRequire,
    };
  }

  /**
   * 取得優惠券名稱驗證規則
   *
   * @returns rules
   */
  static couponTitleValidator() {
    return {
      required: errorMessages.couponTitleRequire,
    };
  }

  /**
   * 取得優惠券代碼驗證規則
   *
   * @returns rules
   */
  static couponCodeValidator() {
    return {
      required: errorMessages.couponCodeRequire,
    };
  }

  /**
   * 取得分類驗證規則
   *
   * @returns rules
   */
  static categoryValidator() {
    return {
      required: errorMessages.categoryRequire,
    };
  }

  /**
   * 取得單位驗證規則
   *
   * @returns rules
   */
  static unitValidator() {
    return {
      required: errorMessages.unitRequire,
    };
  }

  /**
   * 取得價格驗證規則
   *
   * @returns rules
   */
  static priceValidator(name: string) {
    switch (name) {
      case 'origin_price':
        return {
          required: errorMessages.originPriceRequire,
          min: {
            value: 1,
            message: errorMessages.originPriceInvalid,
          },
        };
      case 'price':
        return {
          required: errorMessages.priceRequire,
          min: {
            value: 1,
            message: errorMessages.priceInvalid,
          },
        };
      default:
        break;
    }
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
      case 'origin_price':
        return /^\d/.test(value);
      case 'price':
        return /^\d/.test(value);
      case 'code':
        return /^[0-9a-zA-Z]*$/.test(value);
      default:
        return true;
    }
  }
}

export default ValidationService;
