type ModelAliases = {
  schemas: Record<string, string>;
  definitions: Record<string, string>;
  tiles: Record<string, string>;
};

export const datamodel: ModelAliases = {
  definitions: {
    ed25519: 'kjzl6cwe1jw14bmh141yi5a1nath3ltgzr89exbammai54tjtp1et944x28yh5q',
    verifiableCredential:
      'kjzl6cwe1jw149dwrqgkmdhbxm52t5i0m37k5t7o9y2vf1tncss86iljsin8fpr',
    claimedCredentials:
      'kjzl6cwe1jw14bdckgezfuci7b5if7ussy4zmxj0q97c8jl3zvb172qz7h8jbqd',
    issuedCredentials:
      'kjzl6cwe1jw149hainpftr2tssjnlf2ty154nc137ujqq329aydhsrp5252y0hx',
    heldCredentials:
      'kjzl6cwe1jw14afevdrbxwgcw2aqk3nj0g47w8ermgde61o09o52bn6fkyq7k6i',
    basicProfile:
      'kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic',
    cryptoAccounts:
      'kjzl6cwe1jw149z4rvwzi56mjjukafta30kojzktd9dsrgqdgz4wlnceu59f95f',
    alsoKnownAs:
      'kjzl6cwe1jw146zfmqa10a5x1vry6au3t362p44uttz4l0k4hi88o41zplhmxnf',
  },
  schemas: {
    ED25519:
      'ceramic://k3y52l7qbv1frxke7rk4ulbjdul8au7v7o0a0b7r5mw30w5fmz2070wt8dt2swrgg',
    VerifiableCredential:
      'ceramic://k3y52l7qbv1frxo5510cruhkluijtav39g4vacian4lrh7bxs8vk0b2w7pjmilqtc',
    ClaimedCredentials:
      'ceramic://k3y52l7qbv1frxv8kiit856743dfzrrwsihrfuvdn3y3nvevv4o8zpfdyt0nfwhz4',
    HeldCredentials:
      'ceramic://k3y52l7qbv1fryihueadzabto4qyfkfq11knx3szfrd6yz83c5bbzsuswfyxoqfpc',
    IssuedCredentials:
      'ceramic://k3y52l7qbv1fryp7fle8dvb02bxwugsqhjz3edlzu8n33msm8w33613fdge24aby8',
    BasicProfile:
      'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio',
    CryptoAccounts:
      'ceramic://k3y52l7qbv1frypussjburqg4fykyyycfu0p9znc75lv2t5cg4xaslhagkd7h7mkg',
    AlsoKnownAs:
      'ceramic://k3y52l7qbv1fryojt8n8cw2k04p9wp67ly59iwqs65dejso566fij5wsdrb871yio',
  },
  tiles: {},
};
