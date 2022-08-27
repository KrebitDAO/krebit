interface IOpenOauthUrl {
  url: string;
  width?: number;
  height?: number;
}

export const openOAuthUrl = (props: IOpenOauthUrl): void => {
  const { url, width = 600, height = 800 } = props;

  const left = screen.width / 2 - width / 2;
  const top = screen.height / 2 - height / 2;

  window.open(
    url,
    '_blank',
    'toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, copyhistory=no, width=' +
      width +
      ', height=' +
      height +
      ', top=' +
      top +
      ', left=' +
      left
  );
};
