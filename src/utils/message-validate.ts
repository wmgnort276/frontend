interface IMessageError {
  key: string;
  param: Record<string, any>;
}
const renderMsgValidate = (errorMessage: string | undefined): IMessageError => {
  const result: IMessageError = {
    key: '',
    param: {}
  };
  if (!errorMessage) {
    return result;
  }
  try {
    const data: string[] = errorMessage.split('-');
    result.key = `zod.errors.${data[0]}`;
    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        const item = data[i].split(':');
        result.param[item[0]] = item[1];
      }
    }
  } catch (e: any) {
    console.log(e);
  }
  return result;
};

export { renderMsgValidate };
