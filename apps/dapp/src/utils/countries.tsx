const COUNTRIES = [
  {
    isoCode: 'AF',
    name: 'Afghanistan',
    phonecode: '93',
    flag: '🇦🇫',
    currency: 'AFN',
    latitude: '33.00000000',
    longitude: '65.00000000',
    timezones: [
      {
        zoneName: 'Asia/Kabul',
        gmtOffset: 16200,
        gmtOffsetName: 'UTC+04:30',
        abbreviation: 'AFT',
        tzName: 'Afghanistan Time'
      }
    ]
  },
  {
    isoCode: 'AX',
    name: 'Aland Islands',
    phonecode: '+358-18',
    flag: '🇦🇽',
    currency: 'EUR',
    latitude: '60.11666700',
    longitude: '19.90000000',
    timezones: [
      {
        zoneName: 'Europe/Mariehamn',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'AL',
    name: 'Albania',
    phonecode: '355',
    flag: '🇦🇱',
    currency: 'ALL',
    latitude: '41.00000000',
    longitude: '20.00000000',
    timezones: [
      {
        zoneName: 'Europe/Tirane',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'DZ',
    name: 'Algeria',
    phonecode: '213',
    flag: '🇩🇿',
    currency: 'DZD',
    latitude: '28.00000000',
    longitude: '3.00000000',
    timezones: [
      {
        zoneName: 'Africa/Algiers',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'AS',
    name: 'American Samoa',
    phonecode: '+1-684',
    flag: '🇦🇸',
    currency: 'USD',
    latitude: '-14.33333333',
    longitude: '-170.00000000',
    timezones: [
      {
        zoneName: 'Pacific/Pago_Pago',
        gmtOffset: -39600,
        gmtOffsetName: 'UTC-11:00',
        abbreviation: 'SST',
        tzName: 'Samoa Standard Time'
      }
    ]
  },
  {
    isoCode: 'AD',
    name: 'Andorra',
    phonecode: '376',
    flag: '🇦🇩',
    currency: 'EUR',
    latitude: '42.50000000',
    longitude: '1.50000000',
    timezones: [
      {
        zoneName: 'Europe/Andorra',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'AO',
    name: 'Angola',
    phonecode: '244',
    flag: '🇦🇴',
    currency: 'AOA',
    latitude: '-12.50000000',
    longitude: '18.50000000',
    timezones: [
      {
        zoneName: 'Africa/Luanda',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'WAT',
        tzName: 'West Africa Time'
      }
    ]
  },
  {
    isoCode: 'AI',
    name: 'Anguilla',
    phonecode: '+1-264',
    flag: '🇦🇮',
    currency: 'XCD',
    latitude: '18.25000000',
    longitude: '-63.16666666',
    timezones: [
      {
        zoneName: 'America/Anguilla',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'AQ',
    name: 'Antarctica',
    phonecode: '',
    flag: '🇦🇶',
    currency: '',
    latitude: '-74.65000000',
    longitude: '4.48000000',
    timezones: [
      {
        zoneName: 'Antarctica/Casey',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'AWST',
        tzName: 'Australian Western Standard Time'
      },
      {
        zoneName: 'Antarctica/Davis',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'DAVT',
        tzName: 'Davis Time'
      },
      {
        zoneName: 'Antarctica/DumontDUrville',
        gmtOffset: 36000,
        gmtOffsetName: 'UTC+10:00',
        abbreviation: 'DDUT',
        tzName: "Dumont d'Urville Time"
      },
      {
        zoneName: 'Antarctica/Mawson',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'MAWT',
        tzName: 'Mawson Station Time'
      },
      {
        zoneName: 'Antarctica/McMurdo',
        gmtOffset: 46800,
        gmtOffsetName: 'UTC+13:00',
        abbreviation: 'NZDT',
        tzName: 'New Zealand Daylight Time'
      },
      {
        zoneName: 'Antarctica/Palmer',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'CLST',
        tzName: 'Chile Summer Time'
      },
      {
        zoneName: 'Antarctica/Rothera',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'ROTT',
        tzName: 'Rothera Research Station Time'
      },
      {
        zoneName: 'Antarctica/Syowa',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'SYOT',
        tzName: 'Showa Station Time'
      },
      {
        zoneName: 'Antarctica/Troll',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      },
      {
        zoneName: 'Antarctica/Vostok',
        gmtOffset: 21600,
        gmtOffsetName: 'UTC+06:00',
        abbreviation: 'VOST',
        tzName: 'Vostok Station Time'
      }
    ]
  },
  {
    isoCode: 'AG',
    name: 'Antigua And Barbuda',
    phonecode: '+1-268',
    flag: '🇦🇬',
    currency: 'XCD',
    latitude: '17.05000000',
    longitude: '-61.80000000',
    timezones: [
      {
        zoneName: 'America/Antigua',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'AR',
    name: 'Argentina',
    phonecode: '54',
    flag: '🇦🇷',
    currency: 'ARS',
    latitude: '-34.00000000',
    longitude: '-64.00000000',
    timezones: [
      {
        zoneName: 'America/Argentina/Buenos_Aires',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'ART',
        tzName: 'Argentina Time'
      },
      {
        zoneName: 'America/Argentina/Catamarca',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'ART',
        tzName: 'Argentina Time'
      },
      {
        zoneName: 'America/Argentina/Cordoba',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'ART',
        tzName: 'Argentina Time'
      },
      {
        zoneName: 'America/Argentina/Jujuy',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'ART',
        tzName: 'Argentina Time'
      },
      {
        zoneName: 'America/Argentina/La_Rioja',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'ART',
        tzName: 'Argentina Time'
      },
      {
        zoneName: 'America/Argentina/Mendoza',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'ART',
        tzName: 'Argentina Time'
      },
      {
        zoneName: 'America/Argentina/Rio_Gallegos',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'ART',
        tzName: 'Argentina Time'
      },
      {
        zoneName: 'America/Argentina/Salta',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'ART',
        tzName: 'Argentina Time'
      },
      {
        zoneName: 'America/Argentina/San_Juan',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'ART',
        tzName: 'Argentina Time'
      },
      {
        zoneName: 'America/Argentina/San_Luis',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'ART',
        tzName: 'Argentina Time'
      },
      {
        zoneName: 'America/Argentina/Tucuman',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'ART',
        tzName: 'Argentina Time'
      },
      {
        zoneName: 'America/Argentina/Ushuaia',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'ART',
        tzName: 'Argentina Time'
      }
    ]
  },
  {
    isoCode: 'AM',
    name: 'Armenia',
    phonecode: '374',
    flag: '🇦🇲',
    currency: 'AMD',
    latitude: '40.00000000',
    longitude: '45.00000000',
    timezones: [
      {
        zoneName: 'Asia/Yerevan',
        gmtOffset: 14400,
        gmtOffsetName: 'UTC+04:00',
        abbreviation: 'AMT',
        tzName: 'Armenia Time'
      }
    ]
  },
  {
    isoCode: 'AW',
    name: 'Aruba',
    phonecode: '297',
    flag: '🇦🇼',
    currency: 'AWG',
    latitude: '12.50000000',
    longitude: '-69.96666666',
    timezones: [
      {
        zoneName: 'America/Aruba',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'AU',
    name: 'Australia',
    phonecode: '61',
    flag: '🇦🇺',
    currency: 'AUD',
    latitude: '-27.00000000',
    longitude: '133.00000000',
    timezones: [
      {
        zoneName: 'Antarctica/Macquarie',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'MIST',
        tzName: 'Macquarie Island Station Time'
      },
      {
        zoneName: 'Australia/Adelaide',
        gmtOffset: 37800,
        gmtOffsetName: 'UTC+10:30',
        abbreviation: 'ACDT',
        tzName: 'Australian Central Daylight Saving Time'
      },
      {
        zoneName: 'Australia/Brisbane',
        gmtOffset: 36000,
        gmtOffsetName: 'UTC+10:00',
        abbreviation: 'AEST',
        tzName: 'Australian Eastern Standard Time'
      },
      {
        zoneName: 'Australia/Broken_Hill',
        gmtOffset: 37800,
        gmtOffsetName: 'UTC+10:30',
        abbreviation: 'ACDT',
        tzName: 'Australian Central Daylight Saving Time'
      },
      {
        zoneName: 'Australia/Currie',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'AEDT',
        tzName: 'Australian Eastern Daylight Saving Time'
      },
      {
        zoneName: 'Australia/Darwin',
        gmtOffset: 34200,
        gmtOffsetName: 'UTC+09:30',
        abbreviation: 'ACST',
        tzName: 'Australian Central Standard Time'
      },
      {
        zoneName: 'Australia/Eucla',
        gmtOffset: 31500,
        gmtOffsetName: 'UTC+08:45',
        abbreviation: 'ACWST',
        tzName: 'Australian Central Western Standard Time (Unofficial)'
      },
      {
        zoneName: 'Australia/Hobart',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'AEDT',
        tzName: 'Australian Eastern Daylight Saving Time'
      },
      {
        zoneName: 'Australia/Lindeman',
        gmtOffset: 36000,
        gmtOffsetName: 'UTC+10:00',
        abbreviation: 'AEST',
        tzName: 'Australian Eastern Standard Time'
      },
      {
        zoneName: 'Australia/Lord_Howe',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'LHST',
        tzName: 'Lord Howe Summer Time'
      },
      {
        zoneName: 'Australia/Melbourne',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'AEDT',
        tzName: 'Australian Eastern Daylight Saving Time'
      },
      {
        zoneName: 'Australia/Perth',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'AWST',
        tzName: 'Australian Western Standard Time'
      },
      {
        zoneName: 'Australia/Sydney',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'AEDT',
        tzName: 'Australian Eastern Daylight Saving Time'
      }
    ]
  },
  {
    isoCode: 'AT',
    name: 'Austria',
    phonecode: '43',
    flag: '🇦🇹',
    currency: 'EUR',
    latitude: '47.33333333',
    longitude: '13.33333333',
    timezones: [
      {
        zoneName: 'Europe/Vienna',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'AZ',
    name: 'Azerbaijan',
    phonecode: '994',
    flag: '🇦🇿',
    currency: 'AZN',
    latitude: '40.50000000',
    longitude: '47.50000000',
    timezones: [
      {
        zoneName: 'Asia/Baku',
        gmtOffset: 14400,
        gmtOffsetName: 'UTC+04:00',
        abbreviation: 'AZT',
        tzName: 'Azerbaijan Time'
      }
    ]
  },
  {
    isoCode: 'BS',
    name: 'Bahamas The',
    phonecode: '+1-242',
    flag: '🇧🇸',
    currency: 'BSD',
    latitude: '24.25000000',
    longitude: '-76.00000000',
    timezones: [
      {
        zoneName: 'America/Nassau',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America)'
      }
    ]
  },
  {
    isoCode: 'BH',
    name: 'Bahrain',
    phonecode: '973',
    flag: '🇧🇭',
    currency: 'BHD',
    latitude: '26.00000000',
    longitude: '50.55000000',
    timezones: [
      {
        zoneName: 'Asia/Bahrain',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'AST',
        tzName: 'Arabia Standard Time'
      }
    ]
  },
  {
    isoCode: 'BD',
    name: 'Bangladesh',
    phonecode: '880',
    flag: '🇧🇩',
    currency: 'BDT',
    latitude: '24.00000000',
    longitude: '90.00000000',
    timezones: [
      {
        zoneName: 'Asia/Dhaka',
        gmtOffset: 21600,
        gmtOffsetName: 'UTC+06:00',
        abbreviation: 'BDT',
        tzName: 'Bangladesh Standard Time'
      }
    ]
  },
  {
    isoCode: 'BB',
    name: 'Barbados',
    phonecode: '+1-246',
    flag: '🇧🇧',
    currency: 'BBD',
    latitude: '13.16666666',
    longitude: '-59.53333333',
    timezones: [
      {
        zoneName: 'America/Barbados',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'BY',
    name: 'Belarus',
    phonecode: '375',
    flag: '🇧🇾',
    currency: 'BYN',
    latitude: '53.00000000',
    longitude: '28.00000000',
    timezones: [
      {
        zoneName: 'Europe/Minsk',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'MSK',
        tzName: 'Moscow Time'
      }
    ]
  },
  {
    isoCode: 'BE',
    name: 'Belgium',
    phonecode: '32',
    flag: '🇧🇪',
    currency: 'EUR',
    latitude: '50.83333333',
    longitude: '4.00000000',
    timezones: [
      {
        zoneName: 'Europe/Brussels',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'BZ',
    name: 'Belize',
    phonecode: '501',
    flag: '🇧🇿',
    currency: 'BZD',
    latitude: '17.25000000',
    longitude: '-88.75000000',
    timezones: [
      {
        zoneName: 'America/Belize',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America)'
      }
    ]
  },
  {
    isoCode: 'BJ',
    name: 'Benin',
    phonecode: '229',
    flag: '🇧🇯',
    currency: 'XOF',
    latitude: '9.50000000',
    longitude: '2.25000000',
    timezones: [
      {
        zoneName: 'Africa/Porto-Novo',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'WAT',
        tzName: 'West Africa Time'
      }
    ]
  },
  {
    isoCode: 'BM',
    name: 'Bermuda',
    phonecode: '+1-441',
    flag: '🇧🇲',
    currency: 'BMD',
    latitude: '32.33333333',
    longitude: '-64.75000000',
    timezones: [
      {
        zoneName: 'Atlantic/Bermuda',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'BT',
    name: 'Bhutan',
    phonecode: '975',
    flag: '🇧🇹',
    currency: 'BTN',
    latitude: '27.50000000',
    longitude: '90.50000000',
    timezones: [
      {
        zoneName: 'Asia/Thimphu',
        gmtOffset: 21600,
        gmtOffsetName: 'UTC+06:00',
        abbreviation: 'BTT',
        tzName: 'Bhutan Time'
      }
    ]
  },
  {
    isoCode: 'BO',
    name: 'Bolivia',
    phonecode: '591',
    flag: '🇧🇴',
    currency: 'BOB',
    latitude: '-17.00000000',
    longitude: '-65.00000000',
    timezones: [
      {
        zoneName: 'America/La_Paz',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'BOT',
        tzName: 'Bolivia Time'
      }
    ]
  },
  {
    isoCode: 'BA',
    name: 'Bosnia and Herzegovina',
    phonecode: '387',
    flag: '🇧🇦',
    currency: 'BAM',
    latitude: '44.00000000',
    longitude: '18.00000000',
    timezones: [
      {
        zoneName: 'Europe/Sarajevo',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'BW',
    name: 'Botswana',
    phonecode: '267',
    flag: '🇧🇼',
    currency: 'BWP',
    latitude: '-22.00000000',
    longitude: '24.00000000',
    timezones: [
      {
        zoneName: 'Africa/Gaborone',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'CAT',
        tzName: 'Central Africa Time'
      }
    ]
  },
  {
    isoCode: 'BV',
    name: 'Bouvet Island',
    phonecode: '0055',
    flag: '🇧🇻',
    currency: 'NOK',
    latitude: '-54.43333333',
    longitude: '3.40000000',
    timezones: [
      {
        zoneName: 'Europe/Oslo',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'BR',
    name: 'Brazil',
    phonecode: '55',
    flag: '🇧🇷',
    currency: 'BRL',
    latitude: '-10.00000000',
    longitude: '-55.00000000',
    timezones: [
      {
        zoneName: 'America/Araguaina',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time'
      },
      {
        zoneName: 'America/Bahia',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time'
      },
      {
        zoneName: 'America/Belem',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time'
      },
      {
        zoneName: 'America/Boa_Vista',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AMT',
        tzName: 'Amazon Time (Brazil)[3'
      },
      {
        zoneName: 'America/Campo_Grande',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AMT',
        tzName: 'Amazon Time (Brazil)[3'
      },
      {
        zoneName: 'America/Cuiaba',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'BRT',
        tzName: 'Brasilia Time'
      },
      {
        zoneName: 'America/Eirunepe',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'ACT',
        tzName: 'Acre Time'
      },
      {
        zoneName: 'America/Fortaleza',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time'
      },
      {
        zoneName: 'America/Maceio',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time'
      },
      {
        zoneName: 'America/Manaus',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AMT',
        tzName: 'Amazon Time (Brazil)'
      },
      {
        zoneName: 'America/Noronha',
        gmtOffset: -7200,
        gmtOffsetName: 'UTC-02:00',
        abbreviation: 'FNT',
        tzName: 'Fernando de Noronha Time'
      },
      {
        zoneName: 'America/Porto_Velho',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AMT',
        tzName: 'Amazon Time (Brazil)[3'
      },
      {
        zoneName: 'America/Recife',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time'
      },
      {
        zoneName: 'America/Rio_Branco',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'ACT',
        tzName: 'Acre Time'
      },
      {
        zoneName: 'America/Santarem',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time'
      },
      {
        zoneName: 'America/Sao_Paulo',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time'
      }
    ]
  },
  {
    isoCode: 'IO',
    name: 'British Indian Ocean Territory',
    phonecode: '246',
    flag: '🇮🇴',
    currency: 'USD',
    latitude: '-6.00000000',
    longitude: '71.50000000',
    timezones: [
      {
        zoneName: 'Indian/Chagos',
        gmtOffset: 21600,
        gmtOffsetName: 'UTC+06:00',
        abbreviation: 'IOT',
        tzName: 'Indian Ocean Time'
      }
    ]
  },
  {
    isoCode: 'BN',
    name: 'Brunei',
    phonecode: '673',
    flag: '🇧🇳',
    currency: 'BND',
    latitude: '4.50000000',
    longitude: '114.66666666',
    timezones: [
      {
        zoneName: 'Asia/Brunei',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'BNT',
        tzName: 'Brunei Darussalam Time'
      }
    ]
  },
  {
    isoCode: 'BG',
    name: 'Bulgaria',
    phonecode: '359',
    flag: '🇧🇬',
    currency: 'BGN',
    latitude: '43.00000000',
    longitude: '25.00000000',
    timezones: [
      {
        zoneName: 'Europe/Sofia',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'BF',
    name: 'Burkina Faso',
    phonecode: '226',
    flag: '🇧🇫',
    currency: 'XOF',
    latitude: '13.00000000',
    longitude: '-2.00000000',
    timezones: [
      {
        zoneName: 'Africa/Ouagadougou',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'BI',
    name: 'Burundi',
    phonecode: '257',
    flag: '🇧🇮',
    currency: 'BIF',
    latitude: '-3.50000000',
    longitude: '30.00000000',
    timezones: [
      {
        zoneName: 'Africa/Bujumbura',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'CAT',
        tzName: 'Central Africa Time'
      }
    ]
  },
  {
    isoCode: 'KH',
    name: 'Cambodia',
    phonecode: '855',
    flag: '🇰🇭',
    currency: 'KHR',
    latitude: '13.00000000',
    longitude: '105.00000000',
    timezones: [
      {
        zoneName: 'Asia/Phnom_Penh',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'ICT',
        tzName: 'Indochina Time'
      }
    ]
  },
  {
    isoCode: 'CM',
    name: 'Cameroon',
    phonecode: '237',
    flag: '🇨🇲',
    currency: 'XAF',
    latitude: '6.00000000',
    longitude: '12.00000000',
    timezones: [
      {
        zoneName: 'Africa/Douala',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'WAT',
        tzName: 'West Africa Time'
      }
    ]
  },
  {
    isoCode: 'CA',
    name: 'Canada',
    phonecode: '1',
    flag: '🇨🇦',
    currency: 'CAD',
    latitude: '60.00000000',
    longitude: '-95.00000000',
    timezones: [
      {
        zoneName: 'America/Atikokan',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America)'
      },
      {
        zoneName: 'America/Blanc-Sablon',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      },
      {
        zoneName: 'America/Cambridge_Bay',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America)'
      },
      {
        zoneName: 'America/Creston',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America)'
      },
      {
        zoneName: 'America/Dawson',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America)'
      },
      {
        zoneName: 'America/Dawson_Creek',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America)'
      },
      {
        zoneName: 'America/Edmonton',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America)'
      },
      {
        zoneName: 'America/Fort_Nelson',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America)'
      },
      {
        zoneName: 'America/Glace_Bay',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      },
      {
        zoneName: 'America/Goose_Bay',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      },
      {
        zoneName: 'America/Halifax',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      },
      {
        zoneName: 'America/Inuvik',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America'
      },
      {
        zoneName: 'America/Iqaluit',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Moncton',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      },
      {
        zoneName: 'America/Nipigon',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Pangnirtung',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Rainy_River',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Rankin_Inlet',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Regina',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Resolute',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/St_Johns',
        gmtOffset: -12600,
        gmtOffsetName: 'UTC-03:30',
        abbreviation: 'NST',
        tzName: 'Newfoundland Standard Time'
      },
      {
        zoneName: 'America/Swift_Current',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Thunder_Bay',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Toronto',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Vancouver',
        gmtOffset: -28800,
        gmtOffsetName: 'UTC-08:00',
        abbreviation: 'PST',
        tzName: 'Pacific Standard Time (North America'
      },
      {
        zoneName: 'America/Whitehorse',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America'
      },
      {
        zoneName: 'America/Winnipeg',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Yellowknife',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America'
      }
    ]
  },
  {
    isoCode: 'CV',
    name: 'Cape Verde',
    phonecode: '238',
    flag: '🇨🇻',
    currency: 'CVE',
    latitude: '16.00000000',
    longitude: '-24.00000000',
    timezones: [
      {
        zoneName: 'Atlantic/Cape_Verde',
        gmtOffset: -3600,
        gmtOffsetName: 'UTC-01:00',
        abbreviation: 'CVT',
        tzName: 'Cape Verde Time'
      }
    ]
  },
  {
    isoCode: 'KY',
    name: 'Cayman Islands',
    phonecode: '+1-345',
    flag: '🇰🇾',
    currency: 'KYD',
    latitude: '19.50000000',
    longitude: '-80.50000000',
    timezones: [
      {
        zoneName: 'America/Cayman',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      }
    ]
  },
  {
    isoCode: 'CF',
    name: 'Central African Republic',
    phonecode: '236',
    flag: '🇨🇫',
    currency: 'XAF',
    latitude: '7.00000000',
    longitude: '21.00000000',
    timezones: [
      {
        zoneName: 'Africa/Bangui',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'WAT',
        tzName: 'West Africa Time'
      }
    ]
  },
  {
    isoCode: 'TD',
    name: 'Chad',
    phonecode: '235',
    flag: '🇹🇩',
    currency: 'XAF',
    latitude: '15.00000000',
    longitude: '19.00000000',
    timezones: [
      {
        zoneName: 'Africa/Ndjamena',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'WAT',
        tzName: 'West Africa Time'
      }
    ]
  },
  {
    isoCode: 'CL',
    name: 'Chile',
    phonecode: '56',
    flag: '🇨🇱',
    currency: 'CLP',
    latitude: '-30.00000000',
    longitude: '-71.00000000',
    timezones: [
      {
        zoneName: 'America/Punta_Arenas',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'CLST',
        tzName: 'Chile Summer Time'
      },
      {
        zoneName: 'America/Santiago',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'CLST',
        tzName: 'Chile Summer Time'
      },
      {
        zoneName: 'Pacific/Easter',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EASST',
        tzName: 'Easter Island Summer Time'
      }
    ]
  },
  {
    isoCode: 'CN',
    name: 'China',
    phonecode: '86',
    flag: '🇨🇳',
    currency: 'CNY',
    latitude: '35.00000000',
    longitude: '105.00000000',
    timezones: [
      {
        zoneName: 'Asia/Shanghai',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'CST',
        tzName: 'China Standard Time'
      },
      {
        zoneName: 'Asia/Urumqi',
        gmtOffset: 21600,
        gmtOffsetName: 'UTC+06:00',
        abbreviation: 'XJT',
        tzName: 'China Standard Time'
      }
    ]
  },
  {
    isoCode: 'CX',
    name: 'Christmas Island',
    phonecode: '61',
    flag: '🇨🇽',
    currency: 'AUD',
    latitude: '-10.50000000',
    longitude: '105.66666666',
    timezones: [
      {
        zoneName: 'Indian/Christmas',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'CXT',
        tzName: 'Christmas Island Time'
      }
    ]
  },
  {
    isoCode: 'CC',
    name: 'Cocos (Keeling) Islands',
    phonecode: '61',
    flag: '🇨🇨',
    currency: 'AUD',
    latitude: '-12.50000000',
    longitude: '96.83333333',
    timezones: [
      {
        zoneName: 'Indian/Cocos',
        gmtOffset: 23400,
        gmtOffsetName: 'UTC+06:30',
        abbreviation: 'CCT',
        tzName: 'Cocos Islands Time'
      }
    ]
  },
  {
    isoCode: 'CO',
    name: 'Colombia',
    phonecode: '57',
    flag: '🇨🇴',
    currency: 'COP',
    latitude: '4.00000000',
    longitude: '-72.00000000',
    timezones: [
      {
        zoneName: 'America/Bogota',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'COT',
        tzName: 'Colombia Time'
      }
    ]
  },
  {
    isoCode: 'KM',
    name: 'Comoros',
    phonecode: '269',
    flag: '🇰🇲',
    currency: 'KMF',
    latitude: '-12.16666666',
    longitude: '44.25000000',
    timezones: [
      {
        zoneName: 'Indian/Comoro',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'EAT',
        tzName: 'East Africa Time'
      }
    ]
  },
  {
    isoCode: 'CG',
    name: 'Congo',
    phonecode: '242',
    flag: '🇨🇬',
    currency: 'XAF',
    latitude: '-1.00000000',
    longitude: '15.00000000',
    timezones: [
      {
        zoneName: 'Africa/Brazzaville',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'WAT',
        tzName: 'West Africa Time'
      }
    ]
  },
  {
    isoCode: 'CD',
    name: 'Congo The Democratic Republic Of The',
    phonecode: '243',
    flag: '🇨🇩',
    currency: 'CDF',
    latitude: '0.00000000',
    longitude: '25.00000000',
    timezones: [
      {
        zoneName: 'Africa/Kinshasa',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'WAT',
        tzName: 'West Africa Time'
      },
      {
        zoneName: 'Africa/Lubumbashi',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'CAT',
        tzName: 'Central Africa Time'
      }
    ]
  },
  {
    isoCode: 'CK',
    name: 'Cook Islands',
    phonecode: '682',
    flag: '🇨🇰',
    currency: 'NZD',
    latitude: '-21.23333333',
    longitude: '-159.76666666',
    timezones: [
      {
        zoneName: 'Pacific/Rarotonga',
        gmtOffset: -36000,
        gmtOffsetName: 'UTC-10:00',
        abbreviation: 'CKT',
        tzName: 'Cook Island Time'
      }
    ]
  },
  {
    isoCode: 'CR',
    name: 'Costa Rica',
    phonecode: '506',
    flag: '🇨🇷',
    currency: 'CRC',
    latitude: '10.00000000',
    longitude: '-84.00000000',
    timezones: [
      {
        zoneName: 'America/Costa_Rica',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      }
    ]
  },
  {
    isoCode: 'CI',
    name: "Cote D'Ivoire (Ivory Coast)",
    phonecode: '225',
    flag: '🇨🇮',
    currency: 'XOF',
    latitude: '8.00000000',
    longitude: '-5.00000000',
    timezones: [
      {
        zoneName: 'Africa/Abidjan',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'HR',
    name: 'Croatia (Hrvatska)',
    phonecode: '385',
    flag: '🇭🇷',
    currency: 'HRK',
    latitude: '45.16666666',
    longitude: '15.50000000',
    timezones: [
      {
        zoneName: 'Europe/Zagreb',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'CU',
    name: 'Cuba',
    phonecode: '53',
    flag: '🇨🇺',
    currency: 'CUP',
    latitude: '21.50000000',
    longitude: '-80.00000000',
    timezones: [
      {
        zoneName: 'America/Havana',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'CST',
        tzName: 'Cuba Standard Time'
      }
    ]
  },
  {
    isoCode: 'CY',
    name: 'Cyprus',
    phonecode: '357',
    flag: '🇨🇾',
    currency: 'EUR',
    latitude: '35.00000000',
    longitude: '33.00000000',
    timezones: [
      {
        zoneName: 'Asia/Famagusta',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      },
      {
        zoneName: 'Asia/Nicosia',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'CZ',
    name: 'Czech Republic',
    phonecode: '420',
    flag: '🇨🇿',
    currency: 'CZK',
    latitude: '49.75000000',
    longitude: '15.50000000',
    timezones: [
      {
        zoneName: 'Europe/Prague',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'DK',
    name: 'Denmark',
    phonecode: '45',
    flag: '🇩🇰',
    currency: 'DKK',
    latitude: '56.00000000',
    longitude: '10.00000000',
    timezones: [
      {
        zoneName: 'Europe/Copenhagen',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'DJ',
    name: 'Djibouti',
    phonecode: '253',
    flag: '🇩🇯',
    currency: 'DJF',
    latitude: '11.50000000',
    longitude: '43.00000000',
    timezones: [
      {
        zoneName: 'Africa/Djibouti',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'EAT',
        tzName: 'East Africa Time'
      }
    ]
  },
  {
    isoCode: 'DM',
    name: 'Dominica',
    phonecode: '+1-767',
    flag: '🇩🇲',
    currency: 'XCD',
    latitude: '15.41666666',
    longitude: '-61.33333333',
    timezones: [
      {
        zoneName: 'America/Dominica',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'DO',
    name: 'Dominican Republic',
    phonecode: '+1-809 and 1-829',
    flag: '🇩🇴',
    currency: 'DOP',
    latitude: '19.00000000',
    longitude: '-70.66666666',
    timezones: [
      {
        zoneName: 'America/Santo_Domingo',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'TL',
    name: 'East Timor',
    phonecode: '670',
    flag: '🇹🇱',
    currency: 'USD',
    latitude: '-8.83333333',
    longitude: '125.91666666',
    timezones: [
      {
        zoneName: 'Asia/Dili',
        gmtOffset: 32400,
        gmtOffsetName: 'UTC+09:00',
        abbreviation: 'TLT',
        tzName: 'Timor Leste Time'
      }
    ]
  },
  {
    isoCode: 'EC',
    name: 'Ecuador',
    phonecode: '593',
    flag: '🇪🇨',
    currency: 'USD',
    latitude: '-2.00000000',
    longitude: '-77.50000000',
    timezones: [
      {
        zoneName: 'America/Guayaquil',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'ECT',
        tzName: 'Ecuador Time'
      },
      {
        zoneName: 'Pacific/Galapagos',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'GALT',
        tzName: 'Galápagos Time'
      }
    ]
  },
  {
    isoCode: 'EG',
    name: 'Egypt',
    phonecode: '20',
    flag: '🇪🇬',
    currency: 'EGP',
    latitude: '27.00000000',
    longitude: '30.00000000',
    timezones: [
      {
        zoneName: 'Africa/Cairo',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'SV',
    name: 'El Salvador',
    phonecode: '503',
    flag: '🇸🇻',
    currency: 'USD',
    latitude: '13.83333333',
    longitude: '-88.91666666',
    timezones: [
      {
        zoneName: 'America/El_Salvador',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      }
    ]
  },
  {
    isoCode: 'GQ',
    name: 'Equatorial Guinea',
    phonecode: '240',
    flag: '🇬🇶',
    currency: 'XAF',
    latitude: '2.00000000',
    longitude: '10.00000000',
    timezones: [
      {
        zoneName: 'Africa/Malabo',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'WAT',
        tzName: 'West Africa Time'
      }
    ]
  },
  {
    isoCode: 'ER',
    name: 'Eritrea',
    phonecode: '291',
    flag: '🇪🇷',
    currency: 'ERN',
    latitude: '15.00000000',
    longitude: '39.00000000',
    timezones: [
      {
        zoneName: 'Africa/Asmara',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'EAT',
        tzName: 'East Africa Time'
      }
    ]
  },
  {
    isoCode: 'EE',
    name: 'Estonia',
    phonecode: '372',
    flag: '🇪🇪',
    currency: 'EUR',
    latitude: '59.00000000',
    longitude: '26.00000000',
    timezones: [
      {
        zoneName: 'Europe/Tallinn',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'ET',
    name: 'Ethiopia',
    phonecode: '251',
    flag: '🇪🇹',
    currency: 'ETB',
    latitude: '8.00000000',
    longitude: '38.00000000',
    timezones: [
      {
        zoneName: 'Africa/Addis_Ababa',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'EAT',
        tzName: 'East Africa Time'
      }
    ]
  },
  {
    isoCode: 'FK',
    name: 'Falkland Islands',
    phonecode: '500',
    flag: '🇫🇰',
    currency: 'FKP',
    latitude: '-51.75000000',
    longitude: '-59.00000000',
    timezones: [
      {
        zoneName: 'Atlantic/Stanley',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'FKST',
        tzName: 'Falkland Islands Summer Time'
      }
    ]
  },
  {
    isoCode: 'FO',
    name: 'Faroe Islands',
    phonecode: '298',
    flag: '🇫🇴',
    currency: 'DKK',
    latitude: '62.00000000',
    longitude: '-7.00000000',
    timezones: [
      {
        zoneName: 'Atlantic/Faroe',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'WET',
        tzName: 'Western European Time'
      }
    ]
  },
  {
    isoCode: 'FJ',
    name: 'Fiji Islands',
    phonecode: '679',
    flag: '🇫🇯',
    currency: 'FJD',
    latitude: '-18.00000000',
    longitude: '175.00000000',
    timezones: [
      {
        zoneName: 'Pacific/Fiji',
        gmtOffset: 43200,
        gmtOffsetName: 'UTC+12:00',
        abbreviation: 'FJT',
        tzName: 'Fiji Time'
      }
    ]
  },
  {
    isoCode: 'FI',
    name: 'Finland',
    phonecode: '358',
    flag: '🇫🇮',
    currency: 'EUR',
    latitude: '64.00000000',
    longitude: '26.00000000',
    timezones: [
      {
        zoneName: 'Europe/Helsinki',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'FR',
    name: 'France',
    phonecode: '33',
    flag: '🇫🇷',
    currency: 'EUR',
    latitude: '46.00000000',
    longitude: '2.00000000',
    timezones: [
      {
        zoneName: 'Europe/Paris',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'GF',
    name: 'French Guiana',
    phonecode: '594',
    flag: '🇬🇫',
    currency: 'EUR',
    latitude: '4.00000000',
    longitude: '-53.00000000',
    timezones: [
      {
        zoneName: 'America/Cayenne',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'GFT',
        tzName: 'French Guiana Time'
      }
    ]
  },
  {
    isoCode: 'PF',
    name: 'French Polynesia',
    phonecode: '689',
    flag: '🇵🇫',
    currency: 'XPF',
    latitude: '-15.00000000',
    longitude: '-140.00000000',
    timezones: [
      {
        zoneName: 'Pacific/Gambier',
        gmtOffset: -32400,
        gmtOffsetName: 'UTC-09:00',
        abbreviation: 'GAMT',
        tzName: 'Gambier Islands Time'
      },
      {
        zoneName: 'Pacific/Marquesas',
        gmtOffset: -34200,
        gmtOffsetName: 'UTC-09:30',
        abbreviation: 'MART',
        tzName: 'Marquesas Islands Time'
      },
      {
        zoneName: 'Pacific/Tahiti',
        gmtOffset: -36000,
        gmtOffsetName: 'UTC-10:00',
        abbreviation: 'TAHT',
        tzName: 'Tahiti Time'
      }
    ]
  },
  {
    isoCode: 'TF',
    name: 'French Southern Territories',
    phonecode: '',
    flag: '🇹🇫',
    currency: 'EUR',
    latitude: '-49.25000000',
    longitude: '69.16700000',
    timezones: [
      {
        zoneName: 'Indian/Kerguelen',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'TFT',
        tzName: 'French Southern and Antarctic Time'
      }
    ]
  },
  {
    isoCode: 'GA',
    name: 'Gabon',
    phonecode: '241',
    flag: '🇬🇦',
    currency: 'XAF',
    latitude: '-1.00000000',
    longitude: '11.75000000',
    timezones: [
      {
        zoneName: 'Africa/Libreville',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'WAT',
        tzName: 'West Africa Time'
      }
    ]
  },
  {
    isoCode: 'GM',
    name: 'Gambia The',
    phonecode: '220',
    flag: '🇬🇲',
    currency: 'GMD',
    latitude: '13.46666666',
    longitude: '-16.56666666',
    timezones: [
      {
        zoneName: 'Africa/Banjul',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'GE',
    name: 'Georgia',
    phonecode: '995',
    flag: '🇬🇪',
    currency: 'GEL',
    latitude: '42.00000000',
    longitude: '43.50000000',
    timezones: [
      {
        zoneName: 'Asia/Tbilisi',
        gmtOffset: 14400,
        gmtOffsetName: 'UTC+04:00',
        abbreviation: 'GET',
        tzName: 'Georgia Standard Time'
      }
    ]
  },
  {
    isoCode: 'DE',
    name: 'Germany',
    phonecode: '49',
    flag: '🇩🇪',
    currency: 'EUR',
    latitude: '51.00000000',
    longitude: '9.00000000',
    timezones: [
      {
        zoneName: 'Europe/Berlin',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      },
      {
        zoneName: 'Europe/Busingen',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'GH',
    name: 'Ghana',
    phonecode: '233',
    flag: '🇬🇭',
    currency: 'GHS',
    latitude: '8.00000000',
    longitude: '-2.00000000',
    timezones: [
      {
        zoneName: 'Africa/Accra',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'GI',
    name: 'Gibraltar',
    phonecode: '350',
    flag: '🇬🇮',
    currency: 'GIP',
    latitude: '36.13333333',
    longitude: '-5.35000000',
    timezones: [
      {
        zoneName: 'Europe/Gibraltar',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'GR',
    name: 'Greece',
    phonecode: '30',
    flag: '🇬🇷',
    currency: 'EUR',
    latitude: '39.00000000',
    longitude: '22.00000000',
    timezones: [
      {
        zoneName: 'Europe/Athens',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'GL',
    name: 'Greenland',
    phonecode: '299',
    flag: '🇬🇱',
    currency: 'DKK',
    latitude: '72.00000000',
    longitude: '-40.00000000',
    timezones: [
      {
        zoneName: 'America/Danmarkshavn',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      },
      {
        zoneName: 'America/Nuuk',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'WGT',
        tzName: 'West Greenland Time'
      },
      {
        zoneName: 'America/Scoresbysund',
        gmtOffset: -3600,
        gmtOffsetName: 'UTC-01:00',
        abbreviation: 'EGT',
        tzName: 'Eastern Greenland Time'
      },
      {
        zoneName: 'America/Thule',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'GD',
    name: 'Grenada',
    phonecode: '+1-473',
    flag: '🇬🇩',
    currency: 'XCD',
    latitude: '12.11666666',
    longitude: '-61.66666666',
    timezones: [
      {
        zoneName: 'America/Grenada',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'GP',
    name: 'Guadeloupe',
    phonecode: '590',
    flag: '🇬🇵',
    currency: 'EUR',
    latitude: '16.25000000',
    longitude: '-61.58333300',
    timezones: [
      {
        zoneName: 'America/Guadeloupe',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'GU',
    name: 'Guam',
    phonecode: '+1-671',
    flag: '🇬🇺',
    currency: 'USD',
    latitude: '13.46666666',
    longitude: '144.78333333',
    timezones: [
      {
        zoneName: 'Pacific/Guam',
        gmtOffset: 36000,
        gmtOffsetName: 'UTC+10:00',
        abbreviation: 'CHST',
        tzName: 'Chamorro Standard Time'
      }
    ]
  },
  {
    isoCode: 'GT',
    name: 'Guatemala',
    phonecode: '502',
    flag: '🇬🇹',
    currency: 'GTQ',
    latitude: '15.50000000',
    longitude: '-90.25000000',
    timezones: [
      {
        zoneName: 'America/Guatemala',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      }
    ]
  },
  {
    isoCode: 'GG',
    name: 'Guernsey and Alderney',
    phonecode: '+44-1481',
    flag: '🇬🇬',
    currency: 'GBP',
    latitude: '49.46666666',
    longitude: '-2.58333333',
    timezones: [
      {
        zoneName: 'Europe/Guernsey',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'GN',
    name: 'Guinea',
    phonecode: '224',
    flag: '🇬🇳',
    currency: 'GNF',
    latitude: '11.00000000',
    longitude: '-10.00000000',
    timezones: [
      {
        zoneName: 'Africa/Conakry',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'GW',
    name: 'Guinea-Bissau',
    phonecode: '245',
    flag: '🇬🇼',
    currency: 'XOF',
    latitude: '12.00000000',
    longitude: '-15.00000000',
    timezones: [
      {
        zoneName: 'Africa/Bissau',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'GY',
    name: 'Guyana',
    phonecode: '592',
    flag: '🇬🇾',
    currency: 'GYD',
    latitude: '5.00000000',
    longitude: '-59.00000000',
    timezones: [
      {
        zoneName: 'America/Guyana',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'GYT',
        tzName: 'Guyana Time'
      }
    ]
  },
  {
    isoCode: 'HT',
    name: 'Haiti',
    phonecode: '509',
    flag: '🇭🇹',
    currency: 'HTG',
    latitude: '19.00000000',
    longitude: '-72.41666666',
    timezones: [
      {
        zoneName: 'America/Port-au-Prince',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      }
    ]
  },
  {
    isoCode: 'HM',
    name: 'Heard Island and McDonald Islands',
    phonecode: '',
    flag: '🇭🇲',
    currency: 'AUD',
    latitude: '-53.10000000',
    longitude: '72.51666666',
    timezones: [
      {
        zoneName: 'Indian/Kerguelen',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'TFT',
        tzName: 'French Southern and Antarctic Time'
      }
    ]
  },
  {
    isoCode: 'HN',
    name: 'Honduras',
    phonecode: '504',
    flag: '🇭🇳',
    currency: 'HNL',
    latitude: '15.00000000',
    longitude: '-86.50000000',
    timezones: [
      {
        zoneName: 'America/Tegucigalpa',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      }
    ]
  },
  {
    isoCode: 'HK',
    name: 'Hong Kong S.A.R.',
    phonecode: '852',
    flag: '🇭🇰',
    currency: 'HKD',
    latitude: '22.25000000',
    longitude: '114.16666666',
    timezones: [
      {
        zoneName: 'Asia/Hong_Kong',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'HKT',
        tzName: 'Hong Kong Time'
      }
    ]
  },
  {
    isoCode: 'HU',
    name: 'Hungary',
    phonecode: '36',
    flag: '🇭🇺',
    currency: 'HUF',
    latitude: '47.00000000',
    longitude: '20.00000000',
    timezones: [
      {
        zoneName: 'Europe/Budapest',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'IS',
    name: 'Iceland',
    phonecode: '354',
    flag: '🇮🇸',
    currency: 'ISK',
    latitude: '65.00000000',
    longitude: '-18.00000000',
    timezones: [
      {
        zoneName: 'Atlantic/Reykjavik',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'IN',
    name: 'India',
    phonecode: '91',
    flag: '🇮🇳',
    currency: 'INR',
    latitude: '20.00000000',
    longitude: '77.00000000',
    timezones: [
      {
        zoneName: 'Asia/Kolkata',
        gmtOffset: 19800,
        gmtOffsetName: 'UTC+05:30',
        abbreviation: 'IST',
        tzName: 'Indian Standard Time'
      }
    ]
  },
  {
    isoCode: 'ID',
    name: 'Indonesia',
    phonecode: '62',
    flag: '🇮🇩',
    currency: 'IDR',
    latitude: '-5.00000000',
    longitude: '120.00000000',
    timezones: [
      {
        zoneName: 'Asia/Jakarta',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'WIB',
        tzName: 'Western Indonesian Time'
      },
      {
        zoneName: 'Asia/Jayapura',
        gmtOffset: 32400,
        gmtOffsetName: 'UTC+09:00',
        abbreviation: 'WIT',
        tzName: 'Eastern Indonesian Time'
      },
      {
        zoneName: 'Asia/Makassar',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'WITA',
        tzName: 'Central Indonesia Time'
      },
      {
        zoneName: 'Asia/Pontianak',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'WIB',
        tzName: 'Western Indonesian Time'
      }
    ]
  },
  {
    isoCode: 'IR',
    name: 'Iran',
    phonecode: '98',
    flag: '🇮🇷',
    currency: 'IRR',
    latitude: '32.00000000',
    longitude: '53.00000000',
    timezones: [
      {
        zoneName: 'Asia/Tehran',
        gmtOffset: 12600,
        gmtOffsetName: 'UTC+03:30',
        abbreviation: 'IRDT',
        tzName: 'Iran Daylight Time'
      }
    ]
  },
  {
    isoCode: 'IQ',
    name: 'Iraq',
    phonecode: '964',
    flag: '🇮🇶',
    currency: 'IQD',
    latitude: '33.00000000',
    longitude: '44.00000000',
    timezones: [
      {
        zoneName: 'Asia/Baghdad',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'AST',
        tzName: 'Arabia Standard Time'
      }
    ]
  },
  {
    isoCode: 'IE',
    name: 'Ireland',
    phonecode: '353',
    flag: '🇮🇪',
    currency: 'EUR',
    latitude: '53.00000000',
    longitude: '-8.00000000',
    timezones: [
      {
        zoneName: 'Europe/Dublin',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'IL',
    name: 'Israel',
    phonecode: '972',
    flag: '🇮🇱',
    currency: 'ILS',
    latitude: '31.50000000',
    longitude: '34.75000000',
    timezones: [
      {
        zoneName: 'Asia/Jerusalem',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'IST',
        tzName: 'Israel Standard Time'
      }
    ]
  },
  {
    isoCode: 'IT',
    name: 'Italy',
    phonecode: '39',
    flag: '🇮🇹',
    currency: 'EUR',
    latitude: '42.83333333',
    longitude: '12.83333333',
    timezones: [
      {
        zoneName: 'Europe/Rome',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'JM',
    name: 'Jamaica',
    phonecode: '+1-876',
    flag: '🇯🇲',
    currency: 'JMD',
    latitude: '18.25000000',
    longitude: '-77.50000000',
    timezones: [
      {
        zoneName: 'America/Jamaica',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      }
    ]
  },
  {
    isoCode: 'JP',
    name: 'Japan',
    phonecode: '81',
    flag: '🇯🇵',
    currency: 'JPY',
    latitude: '36.00000000',
    longitude: '138.00000000',
    timezones: [
      {
        zoneName: 'Asia/Tokyo',
        gmtOffset: 32400,
        gmtOffsetName: 'UTC+09:00',
        abbreviation: 'JST',
        tzName: 'Japan Standard Time'
      }
    ]
  },
  {
    isoCode: 'JE',
    name: 'Jersey',
    phonecode: '+44-1534',
    flag: '🇯🇪',
    currency: 'GBP',
    latitude: '49.25000000',
    longitude: '-2.16666666',
    timezones: [
      {
        zoneName: 'Europe/Jersey',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'JO',
    name: 'Jordan',
    phonecode: '962',
    flag: '🇯🇴',
    currency: 'JOD',
    latitude: '31.00000000',
    longitude: '36.00000000',
    timezones: [
      {
        zoneName: 'Asia/Amman',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'KZ',
    name: 'Kazakhstan',
    phonecode: '7',
    flag: '🇰🇿',
    currency: 'KZT',
    latitude: '48.00000000',
    longitude: '68.00000000',
    timezones: [
      {
        zoneName: 'Asia/Almaty',
        gmtOffset: 21600,
        gmtOffsetName: 'UTC+06:00',
        abbreviation: 'ALMT',
        tzName: 'Alma-Ata Time[1'
      },
      {
        zoneName: 'Asia/Aqtau',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'AQTT',
        tzName: 'Aqtobe Time'
      },
      {
        zoneName: 'Asia/Aqtobe',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'AQTT',
        tzName: 'Aqtobe Time'
      },
      {
        zoneName: 'Asia/Atyrau',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'MSD+1',
        tzName: 'Moscow Daylight Time+1'
      },
      {
        zoneName: 'Asia/Oral',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'ORAT',
        tzName: 'Oral Time'
      },
      {
        zoneName: 'Asia/Qostanay',
        gmtOffset: 21600,
        gmtOffsetName: 'UTC+06:00',
        abbreviation: 'QYZST',
        tzName: 'Qyzylorda Summer Time'
      },
      {
        zoneName: 'Asia/Qyzylorda',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'QYZT',
        tzName: 'Qyzylorda Summer Time'
      }
    ]
  },
  {
    isoCode: 'KE',
    name: 'Kenya',
    phonecode: '254',
    flag: '🇰🇪',
    currency: 'KES',
    latitude: '1.00000000',
    longitude: '38.00000000',
    timezones: [
      {
        zoneName: 'Africa/Nairobi',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'EAT',
        tzName: 'East Africa Time'
      }
    ]
  },
  {
    isoCode: 'KI',
    name: 'Kiribati',
    phonecode: '686',
    flag: '🇰🇮',
    currency: 'AUD',
    latitude: '1.41666666',
    longitude: '173.00000000',
    timezones: [
      {
        zoneName: 'Pacific/Enderbury',
        gmtOffset: 46800,
        gmtOffsetName: 'UTC+13:00',
        abbreviation: 'PHOT',
        tzName: 'Phoenix Island Time'
      },
      {
        zoneName: 'Pacific/Kiritimati',
        gmtOffset: 50400,
        gmtOffsetName: 'UTC+14:00',
        abbreviation: 'LINT',
        tzName: 'Line Islands Time'
      },
      {
        zoneName: 'Pacific/Tarawa',
        gmtOffset: 43200,
        gmtOffsetName: 'UTC+12:00',
        abbreviation: 'GILT',
        tzName: 'Gilbert Island Time'
      }
    ]
  },
  {
    isoCode: 'KP',
    name: 'Korea North',
    phonecode: '850',
    flag: '🇰🇵',
    currency: 'KPW',
    latitude: '40.00000000',
    longitude: '127.00000000',
    timezones: [
      {
        zoneName: 'Asia/Pyongyang',
        gmtOffset: 32400,
        gmtOffsetName: 'UTC+09:00',
        abbreviation: 'KST',
        tzName: 'Korea Standard Time'
      }
    ]
  },
  {
    isoCode: 'KR',
    name: 'Korea South',
    phonecode: '82',
    flag: '🇰🇷',
    currency: 'KRW',
    latitude: '37.00000000',
    longitude: '127.50000000',
    timezones: [
      {
        zoneName: 'Asia/Seoul',
        gmtOffset: 32400,
        gmtOffsetName: 'UTC+09:00',
        abbreviation: 'KST',
        tzName: 'Korea Standard Time'
      }
    ]
  },
  {
    isoCode: 'KW',
    name: 'Kuwait',
    phonecode: '965',
    flag: '🇰🇼',
    currency: 'KWD',
    latitude: '29.50000000',
    longitude: '45.75000000',
    timezones: [
      {
        zoneName: 'Asia/Kuwait',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'AST',
        tzName: 'Arabia Standard Time'
      }
    ]
  },
  {
    isoCode: 'KG',
    name: 'Kyrgyzstan',
    phonecode: '996',
    flag: '🇰🇬',
    currency: 'KGS',
    latitude: '41.00000000',
    longitude: '75.00000000',
    timezones: [
      {
        zoneName: 'Asia/Bishkek',
        gmtOffset: 21600,
        gmtOffsetName: 'UTC+06:00',
        abbreviation: 'KGT',
        tzName: 'Kyrgyzstan Time'
      }
    ]
  },
  {
    isoCode: 'LA',
    name: 'Laos',
    phonecode: '856',
    flag: '🇱🇦',
    currency: 'LAK',
    latitude: '18.00000000',
    longitude: '105.00000000',
    timezones: [
      {
        zoneName: 'Asia/Vientiane',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'ICT',
        tzName: 'Indochina Time'
      }
    ]
  },
  {
    isoCode: 'LV',
    name: 'Latvia',
    phonecode: '371',
    flag: '🇱🇻',
    currency: 'EUR',
    latitude: '57.00000000',
    longitude: '25.00000000',
    timezones: [
      {
        zoneName: 'Europe/Riga',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'LB',
    name: 'Lebanon',
    phonecode: '961',
    flag: '🇱🇧',
    currency: 'LBP',
    latitude: '33.83333333',
    longitude: '35.83333333',
    timezones: [
      {
        zoneName: 'Asia/Beirut',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'LS',
    name: 'Lesotho',
    phonecode: '266',
    flag: '🇱🇸',
    currency: 'LSL',
    latitude: '-29.50000000',
    longitude: '28.50000000',
    timezones: [
      {
        zoneName: 'Africa/Maseru',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'SAST',
        tzName: 'South African Standard Time'
      }
    ]
  },
  {
    isoCode: 'LR',
    name: 'Liberia',
    phonecode: '231',
    flag: '🇱🇷',
    currency: 'LRD',
    latitude: '6.50000000',
    longitude: '-9.50000000',
    timezones: [
      {
        zoneName: 'Africa/Monrovia',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'LY',
    name: 'Libya',
    phonecode: '218',
    flag: '🇱🇾',
    currency: 'LYD',
    latitude: '25.00000000',
    longitude: '17.00000000',
    timezones: [
      {
        zoneName: 'Africa/Tripoli',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'LI',
    name: 'Liechtenstein',
    phonecode: '423',
    flag: '🇱🇮',
    currency: 'CHF',
    latitude: '47.26666666',
    longitude: '9.53333333',
    timezones: [
      {
        zoneName: 'Europe/Vaduz',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'LT',
    name: 'Lithuania',
    phonecode: '370',
    flag: '🇱🇹',
    currency: 'EUR',
    latitude: '56.00000000',
    longitude: '24.00000000',
    timezones: [
      {
        zoneName: 'Europe/Vilnius',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'LU',
    name: 'Luxembourg',
    phonecode: '352',
    flag: '🇱🇺',
    currency: 'EUR',
    latitude: '49.75000000',
    longitude: '6.16666666',
    timezones: [
      {
        zoneName: 'Europe/Luxembourg',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'MO',
    name: 'Macau S.A.R.',
    phonecode: '853',
    flag: '🇲🇴',
    currency: 'MOP',
    latitude: '22.16666666',
    longitude: '113.55000000',
    timezones: [
      {
        zoneName: 'Asia/Macau',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'CST',
        tzName: 'China Standard Time'
      }
    ]
  },
  {
    isoCode: 'MK',
    name: 'Macedonia',
    phonecode: '389',
    flag: '🇲🇰',
    currency: 'MKD',
    latitude: '41.83333333',
    longitude: '22.00000000',
    timezones: [
      {
        zoneName: 'Europe/Skopje',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'MG',
    name: 'Madagascar',
    phonecode: '261',
    flag: '🇲🇬',
    currency: 'MGA',
    latitude: '-20.00000000',
    longitude: '47.00000000',
    timezones: [
      {
        zoneName: 'Indian/Antananarivo',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'EAT',
        tzName: 'East Africa Time'
      }
    ]
  },
  {
    isoCode: 'MW',
    name: 'Malawi',
    phonecode: '265',
    flag: '🇲🇼',
    currency: 'MWK',
    latitude: '-13.50000000',
    longitude: '34.00000000',
    timezones: [
      {
        zoneName: 'Africa/Blantyre',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'CAT',
        tzName: 'Central Africa Time'
      }
    ]
  },
  {
    isoCode: 'MY',
    name: 'Malaysia',
    phonecode: '60',
    flag: '🇲🇾',
    currency: 'MYR',
    latitude: '2.50000000',
    longitude: '112.50000000',
    timezones: [
      {
        zoneName: 'Asia/Kuala_Lumpur',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'MYT',
        tzName: 'Malaysia Time'
      },
      {
        zoneName: 'Asia/Kuching',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'MYT',
        tzName: 'Malaysia Time'
      }
    ]
  },
  {
    isoCode: 'MV',
    name: 'Maldives',
    phonecode: '960',
    flag: '🇲🇻',
    currency: 'MVR',
    latitude: '3.25000000',
    longitude: '73.00000000',
    timezones: [
      {
        zoneName: 'Indian/Maldives',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'MVT',
        tzName: 'Maldives Time'
      }
    ]
  },
  {
    isoCode: 'ML',
    name: 'Mali',
    phonecode: '223',
    flag: '🇲🇱',
    currency: 'XOF',
    latitude: '17.00000000',
    longitude: '-4.00000000',
    timezones: [
      {
        zoneName: 'Africa/Bamako',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'MT',
    name: 'Malta',
    phonecode: '356',
    flag: '🇲🇹',
    currency: 'EUR',
    latitude: '35.83333333',
    longitude: '14.58333333',
    timezones: [
      {
        zoneName: 'Europe/Malta',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'IM',
    name: 'Man (Isle of)',
    phonecode: '+44-1624',
    flag: '🇮🇲',
    currency: 'GBP',
    latitude: '54.25000000',
    longitude: '-4.50000000',
    timezones: [
      {
        zoneName: 'Europe/Isle_of_Man',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'MH',
    name: 'Marshall Islands',
    phonecode: '692',
    flag: '🇲🇭',
    currency: 'USD',
    latitude: '9.00000000',
    longitude: '168.00000000',
    timezones: [
      {
        zoneName: 'Pacific/Kwajalein',
        gmtOffset: 43200,
        gmtOffsetName: 'UTC+12:00',
        abbreviation: 'MHT',
        tzName: 'Marshall Islands Time'
      },
      {
        zoneName: 'Pacific/Majuro',
        gmtOffset: 43200,
        gmtOffsetName: 'UTC+12:00',
        abbreviation: 'MHT',
        tzName: 'Marshall Islands Time'
      }
    ]
  },
  {
    isoCode: 'MQ',
    name: 'Martinique',
    phonecode: '596',
    flag: '🇲🇶',
    currency: 'EUR',
    latitude: '14.66666700',
    longitude: '-61.00000000',
    timezones: [
      {
        zoneName: 'America/Martinique',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'MR',
    name: 'Mauritania',
    phonecode: '222',
    flag: '🇲🇷',
    currency: 'MRO',
    latitude: '20.00000000',
    longitude: '-12.00000000',
    timezones: [
      {
        zoneName: 'Africa/Nouakchott',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'MU',
    name: 'Mauritius',
    phonecode: '230',
    flag: '🇲🇺',
    currency: 'MUR',
    latitude: '-20.28333333',
    longitude: '57.55000000',
    timezones: [
      {
        zoneName: 'Indian/Mauritius',
        gmtOffset: 14400,
        gmtOffsetName: 'UTC+04:00',
        abbreviation: 'MUT',
        tzName: 'Mauritius Time'
      }
    ]
  },
  {
    isoCode: 'YT',
    name: 'Mayotte',
    phonecode: '262',
    flag: '🇾🇹',
    currency: 'EUR',
    latitude: '-12.83333333',
    longitude: '45.16666666',
    timezones: [
      {
        zoneName: 'Indian/Mayotte',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'EAT',
        tzName: 'East Africa Time'
      }
    ]
  },
  {
    isoCode: 'MX',
    name: 'Mexico',
    phonecode: '52',
    flag: '🇲🇽',
    currency: 'MXN',
    latitude: '23.00000000',
    longitude: '-102.00000000',
    timezones: [
      {
        zoneName: 'America/Bahia_Banderas',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Cancun',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Chihuahua',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America'
      },
      {
        zoneName: 'America/Hermosillo',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America'
      },
      {
        zoneName: 'America/Matamoros',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Mazatlan',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America'
      },
      {
        zoneName: 'America/Merida',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Mexico_City',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Monterrey',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Ojinaga',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America'
      },
      {
        zoneName: 'America/Tijuana',
        gmtOffset: -28800,
        gmtOffsetName: 'UTC-08:00',
        abbreviation: 'PST',
        tzName: 'Pacific Standard Time (North America'
      }
    ]
  },
  {
    isoCode: 'FM',
    name: 'Micronesia',
    phonecode: '691',
    flag: '🇫🇲',
    currency: 'USD',
    latitude: '6.91666666',
    longitude: '158.25000000',
    timezones: [
      {
        zoneName: 'Pacific/Chuuk',
        gmtOffset: 36000,
        gmtOffsetName: 'UTC+10:00',
        abbreviation: 'CHUT',
        tzName: 'Chuuk Time'
      },
      {
        zoneName: 'Pacific/Kosrae',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'KOST',
        tzName: 'Kosrae Time'
      },
      {
        zoneName: 'Pacific/Pohnpei',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'PONT',
        tzName: 'Pohnpei Standard Time'
      }
    ]
  },
  {
    isoCode: 'MD',
    name: 'Moldova',
    phonecode: '373',
    flag: '🇲🇩',
    currency: 'MDL',
    latitude: '47.00000000',
    longitude: '29.00000000',
    timezones: [
      {
        zoneName: 'Europe/Chisinau',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'MC',
    name: 'Monaco',
    phonecode: '377',
    flag: '🇲🇨',
    currency: 'EUR',
    latitude: '43.73333333',
    longitude: '7.40000000',
    timezones: [
      {
        zoneName: 'Europe/Monaco',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'MN',
    name: 'Mongolia',
    phonecode: '976',
    flag: '🇲🇳',
    currency: 'MNT',
    latitude: '46.00000000',
    longitude: '105.00000000',
    timezones: [
      {
        zoneName: 'Asia/Choibalsan',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'CHOT',
        tzName: 'Choibalsan Standard Time'
      },
      {
        zoneName: 'Asia/Hovd',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'HOVT',
        tzName: 'Hovd Time'
      },
      {
        zoneName: 'Asia/Ulaanbaatar',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'ULAT',
        tzName: 'Ulaanbaatar Standard Time'
      }
    ]
  },
  {
    isoCode: 'ME',
    name: 'Montenegro',
    phonecode: '382',
    flag: '🇲🇪',
    currency: 'EUR',
    latitude: '42.50000000',
    longitude: '19.30000000',
    timezones: [
      {
        zoneName: 'Europe/Podgorica',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'MS',
    name: 'Montserrat',
    phonecode: '+1-664',
    flag: '🇲🇸',
    currency: 'XCD',
    latitude: '16.75000000',
    longitude: '-62.20000000',
    timezones: [
      {
        zoneName: 'America/Montserrat',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'MA',
    name: 'Morocco',
    phonecode: '212',
    flag: '🇲🇦',
    currency: 'MAD',
    latitude: '32.00000000',
    longitude: '-5.00000000',
    timezones: [
      {
        zoneName: 'Africa/Casablanca',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'WEST',
        tzName: 'Western European Summer Time'
      }
    ]
  },
  {
    isoCode: 'MZ',
    name: 'Mozambique',
    phonecode: '258',
    flag: '🇲🇿',
    currency: 'MZN',
    latitude: '-18.25000000',
    longitude: '35.00000000',
    timezones: [
      {
        zoneName: 'Africa/Maputo',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'CAT',
        tzName: 'Central Africa Time'
      }
    ]
  },
  {
    isoCode: 'MM',
    name: 'Myanmar',
    phonecode: '95',
    flag: '🇲🇲',
    currency: 'MMK',
    latitude: '22.00000000',
    longitude: '98.00000000',
    timezones: [
      {
        zoneName: 'Asia/Yangon',
        gmtOffset: 23400,
        gmtOffsetName: 'UTC+06:30',
        abbreviation: 'MMT',
        tzName: 'Myanmar Standard Time'
      }
    ]
  },
  {
    isoCode: 'NA',
    name: 'Namibia',
    phonecode: '264',
    flag: '🇳🇦',
    currency: 'NAD',
    latitude: '-22.00000000',
    longitude: '17.00000000',
    timezones: [
      {
        zoneName: 'Africa/Windhoek',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'WAST',
        tzName: 'West Africa Summer Time'
      }
    ]
  },
  {
    isoCode: 'NR',
    name: 'Nauru',
    phonecode: '674',
    flag: '🇳🇷',
    currency: 'AUD',
    latitude: '-0.53333333',
    longitude: '166.91666666',
    timezones: [
      {
        zoneName: 'Pacific/Nauru',
        gmtOffset: 43200,
        gmtOffsetName: 'UTC+12:00',
        abbreviation: 'NRT',
        tzName: 'Nauru Time'
      }
    ]
  },
  {
    isoCode: 'NP',
    name: 'Nepal',
    phonecode: '977',
    flag: '🇳🇵',
    currency: 'NPR',
    latitude: '28.00000000',
    longitude: '84.00000000',
    timezones: [
      {
        zoneName: 'Asia/Kathmandu',
        gmtOffset: 20700,
        gmtOffsetName: 'UTC+05:45',
        abbreviation: 'NPT',
        tzName: 'Nepal Time'
      }
    ]
  },
  {
    isoCode: 'BQ',
    name: 'Bonaire, Sint Eustatius and Saba',
    phonecode: '599',
    flag: '🇧🇶',
    currency: 'USD',
    latitude: '12.15000000',
    longitude: '-68.26666700',
    timezones: [
      {
        zoneName: 'America/Anguilla',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'NL',
    name: 'Netherlands The',
    phonecode: '31',
    flag: '🇳🇱',
    currency: 'EUR',
    latitude: '52.50000000',
    longitude: '5.75000000',
    timezones: [
      {
        zoneName: 'Europe/Amsterdam',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'NC',
    name: 'New Caledonia',
    phonecode: '687',
    flag: '🇳🇨',
    currency: 'XPF',
    latitude: '-21.50000000',
    longitude: '165.50000000',
    timezones: [
      {
        zoneName: 'Pacific/Noumea',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'NCT',
        tzName: 'New Caledonia Time'
      }
    ]
  },
  {
    isoCode: 'NZ',
    name: 'New Zealand',
    phonecode: '64',
    flag: '🇳🇿',
    currency: 'NZD',
    latitude: '-41.00000000',
    longitude: '174.00000000',
    timezones: [
      {
        zoneName: 'Pacific/Auckland',
        gmtOffset: 46800,
        gmtOffsetName: 'UTC+13:00',
        abbreviation: 'NZDT',
        tzName: 'New Zealand Daylight Time'
      },
      {
        zoneName: 'Pacific/Chatham',
        gmtOffset: 49500,
        gmtOffsetName: 'UTC+13:45',
        abbreviation: 'CHAST',
        tzName: 'Chatham Standard Time'
      }
    ]
  },
  {
    isoCode: 'NI',
    name: 'Nicaragua',
    phonecode: '505',
    flag: '🇳🇮',
    currency: 'NIO',
    latitude: '13.00000000',
    longitude: '-85.00000000',
    timezones: [
      {
        zoneName: 'America/Managua',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      }
    ]
  },
  {
    isoCode: 'NE',
    name: 'Niger',
    phonecode: '227',
    flag: '🇳🇪',
    currency: 'XOF',
    latitude: '16.00000000',
    longitude: '8.00000000',
    timezones: [
      {
        zoneName: 'Africa/Niamey',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'WAT',
        tzName: 'West Africa Time'
      }
    ]
  },
  {
    isoCode: 'NG',
    name: 'Nigeria',
    phonecode: '234',
    flag: '🇳🇬',
    currency: 'NGN',
    latitude: '10.00000000',
    longitude: '8.00000000',
    timezones: [
      {
        zoneName: 'Africa/Lagos',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'WAT',
        tzName: 'West Africa Time'
      }
    ]
  },
  {
    isoCode: 'NU',
    name: 'Niue',
    phonecode: '683',
    flag: '🇳🇺',
    currency: 'NZD',
    latitude: '-19.03333333',
    longitude: '-169.86666666',
    timezones: [
      {
        zoneName: 'Pacific/Niue',
        gmtOffset: -39600,
        gmtOffsetName: 'UTC-11:00',
        abbreviation: 'NUT',
        tzName: 'Niue Time'
      }
    ]
  },
  {
    isoCode: 'NF',
    name: 'Norfolk Island',
    phonecode: '672',
    flag: '🇳🇫',
    currency: 'AUD',
    latitude: '-29.03333333',
    longitude: '167.95000000',
    timezones: [
      {
        zoneName: 'Pacific/Norfolk',
        gmtOffset: 43200,
        gmtOffsetName: 'UTC+12:00',
        abbreviation: 'NFT',
        tzName: 'Norfolk Time'
      }
    ]
  },
  {
    isoCode: 'MP',
    name: 'Northern Mariana Islands',
    phonecode: '+1-670',
    flag: '🇲🇵',
    currency: 'USD',
    latitude: '15.20000000',
    longitude: '145.75000000',
    timezones: [
      {
        zoneName: 'Pacific/Saipan',
        gmtOffset: 36000,
        gmtOffsetName: 'UTC+10:00',
        abbreviation: 'ChST',
        tzName: 'Chamorro Standard Time'
      }
    ]
  },
  {
    isoCode: 'NO',
    name: 'Norway',
    phonecode: '47',
    flag: '🇳🇴',
    currency: 'NOK',
    latitude: '62.00000000',
    longitude: '10.00000000',
    timezones: [
      {
        zoneName: 'Europe/Oslo',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'OM',
    name: 'Oman',
    phonecode: '968',
    flag: '🇴🇲',
    currency: 'OMR',
    latitude: '21.00000000',
    longitude: '57.00000000',
    timezones: [
      {
        zoneName: 'Asia/Muscat',
        gmtOffset: 14400,
        gmtOffsetName: 'UTC+04:00',
        abbreviation: 'GST',
        tzName: 'Gulf Standard Time'
      }
    ]
  },
  {
    isoCode: 'PK',
    name: 'Pakistan',
    phonecode: '92',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: '30.00000000',
    longitude: '70.00000000',
    timezones: [
      {
        zoneName: 'Asia/Karachi',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'PKT',
        tzName: 'Pakistan Standard Time'
      }
    ]
  },
  {
    isoCode: 'PW',
    name: 'Palau',
    phonecode: '680',
    flag: '🇵🇼',
    currency: 'USD',
    latitude: '7.50000000',
    longitude: '134.50000000',
    timezones: [
      {
        zoneName: 'Pacific/Palau',
        gmtOffset: 32400,
        gmtOffsetName: 'UTC+09:00',
        abbreviation: 'PWT',
        tzName: 'Palau Time'
      }
    ]
  },
  {
    isoCode: 'PS',
    name: 'Palestinian Territory Occupied',
    phonecode: '970',
    flag: '🇵🇸',
    currency: 'ILS',
    latitude: '31.90000000',
    longitude: '35.20000000',
    timezones: [
      {
        zoneName: 'Asia/Gaza',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      },
      {
        zoneName: 'Asia/Hebron',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'PA',
    name: 'Panama',
    phonecode: '507',
    flag: '🇵🇦',
    currency: 'PAB',
    latitude: '9.00000000',
    longitude: '-80.00000000',
    timezones: [
      {
        zoneName: 'America/Panama',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      }
    ]
  },
  {
    isoCode: 'PG',
    name: 'Papua new Guinea',
    phonecode: '675',
    flag: '🇵🇬',
    currency: 'PGK',
    latitude: '-6.00000000',
    longitude: '147.00000000',
    timezones: [
      {
        zoneName: 'Pacific/Bougainville',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'BST',
        tzName: 'Bougainville Standard Time[6'
      },
      {
        zoneName: 'Pacific/Port_Moresby',
        gmtOffset: 36000,
        gmtOffsetName: 'UTC+10:00',
        abbreviation: 'PGT',
        tzName: 'Papua New Guinea Time'
      }
    ]
  },
  {
    isoCode: 'PY',
    name: 'Paraguay',
    phonecode: '595',
    flag: '🇵🇾',
    currency: 'PYG',
    latitude: '-23.00000000',
    longitude: '-58.00000000',
    timezones: [
      {
        zoneName: 'America/Asuncion',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'PYST',
        tzName: 'Paraguay Summer Time'
      }
    ]
  },
  {
    isoCode: 'PE',
    name: 'Peru',
    phonecode: '51',
    flag: '🇵🇪',
    currency: 'PEN',
    latitude: '-10.00000000',
    longitude: '-76.00000000',
    timezones: [
      {
        zoneName: 'America/Lima',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'PET',
        tzName: 'Peru Time'
      }
    ]
  },
  {
    isoCode: 'PH',
    name: 'Philippines',
    phonecode: '63',
    flag: '🇵🇭',
    currency: 'PHP',
    latitude: '13.00000000',
    longitude: '122.00000000',
    timezones: [
      {
        zoneName: 'Asia/Manila',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'PHT',
        tzName: 'Philippine Time'
      }
    ]
  },
  {
    isoCode: 'PN',
    name: 'Pitcairn Island',
    phonecode: '870',
    flag: '🇵🇳',
    currency: 'NZD',
    latitude: '-25.06666666',
    longitude: '-130.10000000',
    timezones: [
      {
        zoneName: 'Pacific/Pitcairn',
        gmtOffset: -28800,
        gmtOffsetName: 'UTC-08:00',
        abbreviation: 'PST',
        tzName: 'Pacific Standard Time (North America'
      }
    ]
  },
  {
    isoCode: 'PL',
    name: 'Poland',
    phonecode: '48',
    flag: '🇵🇱',
    currency: 'PLN',
    latitude: '52.00000000',
    longitude: '20.00000000',
    timezones: [
      {
        zoneName: 'Europe/Warsaw',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'PT',
    name: 'Portugal',
    phonecode: '351',
    flag: '🇵🇹',
    currency: 'EUR',
    latitude: '39.50000000',
    longitude: '-8.00000000',
    timezones: [
      {
        zoneName: 'Atlantic/Azores',
        gmtOffset: -3600,
        gmtOffsetName: 'UTC-01:00',
        abbreviation: 'AZOT',
        tzName: 'Azores Standard Time'
      },
      {
        zoneName: 'Atlantic/Madeira',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'WET',
        tzName: 'Western European Time'
      },
      {
        zoneName: 'Europe/Lisbon',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'WET',
        tzName: 'Western European Time'
      }
    ]
  },
  {
    isoCode: 'PR',
    name: 'Puerto Rico',
    phonecode: '+1-787 and 1-939',
    flag: '🇵🇷',
    currency: 'USD',
    latitude: '18.25000000',
    longitude: '-66.50000000',
    timezones: [
      {
        zoneName: 'America/Puerto_Rico',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'QA',
    name: 'Qatar',
    phonecode: '974',
    flag: '🇶🇦',
    currency: 'QAR',
    latitude: '25.50000000',
    longitude: '51.25000000',
    timezones: [
      {
        zoneName: 'Asia/Qatar',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'AST',
        tzName: 'Arabia Standard Time'
      }
    ]
  },
  {
    isoCode: 'RE',
    name: 'Reunion',
    phonecode: '262',
    flag: '🇷🇪',
    currency: 'EUR',
    latitude: '-21.15000000',
    longitude: '55.50000000',
    timezones: [
      {
        zoneName: 'Indian/Reunion',
        gmtOffset: 14400,
        gmtOffsetName: 'UTC+04:00',
        abbreviation: 'RET',
        tzName: 'Réunion Time'
      }
    ]
  },
  {
    isoCode: 'RO',
    name: 'Romania',
    phonecode: '40',
    flag: '🇷🇴',
    currency: 'RON',
    latitude: '46.00000000',
    longitude: '25.00000000',
    timezones: [
      {
        zoneName: 'Europe/Bucharest',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'RU',
    name: 'Russia',
    phonecode: '7',
    flag: '🇷🇺',
    currency: 'RUB',
    latitude: '60.00000000',
    longitude: '100.00000000',
    timezones: [
      {
        zoneName: 'Asia/Anadyr',
        gmtOffset: 43200,
        gmtOffsetName: 'UTC+12:00',
        abbreviation: 'ANAT',
        tzName: 'Anadyr Time[4'
      },
      {
        zoneName: 'Asia/Barnaul',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'KRAT',
        tzName: 'Krasnoyarsk Time'
      },
      {
        zoneName: 'Asia/Chita',
        gmtOffset: 32400,
        gmtOffsetName: 'UTC+09:00',
        abbreviation: 'YAKT',
        tzName: 'Yakutsk Time'
      },
      {
        zoneName: 'Asia/Irkutsk',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'IRKT',
        tzName: 'Irkutsk Time'
      },
      {
        zoneName: 'Asia/Kamchatka',
        gmtOffset: 43200,
        gmtOffsetName: 'UTC+12:00',
        abbreviation: 'PETT',
        tzName: 'Kamchatka Time'
      },
      {
        zoneName: 'Asia/Khandyga',
        gmtOffset: 32400,
        gmtOffsetName: 'UTC+09:00',
        abbreviation: 'YAKT',
        tzName: 'Yakutsk Time'
      },
      {
        zoneName: 'Asia/Krasnoyarsk',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'KRAT',
        tzName: 'Krasnoyarsk Time'
      },
      {
        zoneName: 'Asia/Magadan',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'MAGT',
        tzName: 'Magadan Time'
      },
      {
        zoneName: 'Asia/Novokuznetsk',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'KRAT',
        tzName: 'Krasnoyarsk Time'
      },
      {
        zoneName: 'Asia/Novosibirsk',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'NOVT',
        tzName: 'Novosibirsk Time'
      },
      {
        zoneName: 'Asia/Omsk',
        gmtOffset: 21600,
        gmtOffsetName: 'UTC+06:00',
        abbreviation: 'OMST',
        tzName: 'Omsk Time'
      },
      {
        zoneName: 'Asia/Sakhalin',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'SAKT',
        tzName: 'Sakhalin Island Time'
      },
      {
        zoneName: 'Asia/Srednekolymsk',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'SRET',
        tzName: 'Srednekolymsk Time'
      },
      {
        zoneName: 'Asia/Tomsk',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'MSD+3',
        tzName: 'Moscow Daylight Time+3'
      },
      {
        zoneName: 'Asia/Ust-Nera',
        gmtOffset: 36000,
        gmtOffsetName: 'UTC+10:00',
        abbreviation: 'VLAT',
        tzName: 'Vladivostok Time'
      },
      {
        zoneName: 'Asia/Vladivostok',
        gmtOffset: 36000,
        gmtOffsetName: 'UTC+10:00',
        abbreviation: 'VLAT',
        tzName: 'Vladivostok Time'
      },
      {
        zoneName: 'Asia/Yakutsk',
        gmtOffset: 32400,
        gmtOffsetName: 'UTC+09:00',
        abbreviation: 'YAKT',
        tzName: 'Yakutsk Time'
      },
      {
        zoneName: 'Asia/Yekaterinburg',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'YEKT',
        tzName: 'Yekaterinburg Time'
      },
      {
        zoneName: 'Europe/Astrakhan',
        gmtOffset: 14400,
        gmtOffsetName: 'UTC+04:00',
        abbreviation: 'SAMT',
        tzName: 'Samara Time'
      },
      {
        zoneName: 'Europe/Kaliningrad',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      },
      {
        zoneName: 'Europe/Kirov',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'MSK',
        tzName: 'Moscow Time'
      },
      {
        zoneName: 'Europe/Moscow',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'MSK',
        tzName: 'Moscow Time'
      },
      {
        zoneName: 'Europe/Samara',
        gmtOffset: 14400,
        gmtOffsetName: 'UTC+04:00',
        abbreviation: 'SAMT',
        tzName: 'Samara Time'
      },
      {
        zoneName: 'Europe/Saratov',
        gmtOffset: 14400,
        gmtOffsetName: 'UTC+04:00',
        abbreviation: 'MSD',
        tzName: 'Moscow Daylight Time+4'
      },
      {
        zoneName: 'Europe/Ulyanovsk',
        gmtOffset: 14400,
        gmtOffsetName: 'UTC+04:00',
        abbreviation: 'SAMT',
        tzName: 'Samara Time'
      },
      {
        zoneName: 'Europe/Volgograd',
        gmtOffset: 14400,
        gmtOffsetName: 'UTC+04:00',
        abbreviation: 'MSK',
        tzName: 'Moscow Standard Time'
      }
    ]
  },
  {
    isoCode: 'RW',
    name: 'Rwanda',
    phonecode: '250',
    flag: '🇷🇼',
    currency: 'RWF',
    latitude: '-2.00000000',
    longitude: '30.00000000',
    timezones: [
      {
        zoneName: 'Africa/Kigali',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'CAT',
        tzName: 'Central Africa Time'
      }
    ]
  },
  {
    isoCode: 'SH',
    name: 'Saint Helena',
    phonecode: '290',
    flag: '🇸🇭',
    currency: 'SHP',
    latitude: '-15.95000000',
    longitude: '-5.70000000',
    timezones: [
      {
        zoneName: 'Atlantic/St_Helena',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'KN',
    name: 'Saint Kitts And Nevis',
    phonecode: '+1-869',
    flag: '🇰🇳',
    currency: 'XCD',
    latitude: '17.33333333',
    longitude: '-62.75000000',
    timezones: [
      {
        zoneName: 'America/St_Kitts',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'LC',
    name: 'Saint Lucia',
    phonecode: '+1-758',
    flag: '🇱🇨',
    currency: 'XCD',
    latitude: '13.88333333',
    longitude: '-60.96666666',
    timezones: [
      {
        zoneName: 'America/St_Lucia',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'PM',
    name: 'Saint Pierre and Miquelon',
    phonecode: '508',
    flag: '🇵🇲',
    currency: 'EUR',
    latitude: '46.83333333',
    longitude: '-56.33333333',
    timezones: [
      {
        zoneName: 'America/Miquelon',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'PMDT',
        tzName: 'Pierre & Miquelon Daylight Time'
      }
    ]
  },
  {
    isoCode: 'VC',
    name: 'Saint Vincent And The Grenadines',
    phonecode: '+1-784',
    flag: '🇻🇨',
    currency: 'XCD',
    latitude: '13.25000000',
    longitude: '-61.20000000',
    timezones: [
      {
        zoneName: 'America/St_Vincent',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'BL',
    name: 'Saint-Barthelemy',
    phonecode: '590',
    flag: '🇧🇱',
    currency: 'EUR',
    latitude: '18.50000000',
    longitude: '-63.41666666',
    timezones: [
      {
        zoneName: 'America/St_Barthelemy',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'MF',
    name: 'Saint-Martin (French part)',
    phonecode: '590',
    flag: '🇲🇫',
    currency: 'EUR',
    latitude: '18.08333333',
    longitude: '-63.95000000',
    timezones: [
      {
        zoneName: 'America/Marigot',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'WS',
    name: 'Samoa',
    phonecode: '685',
    flag: '🇼🇸',
    currency: 'WST',
    latitude: '-13.58333333',
    longitude: '-172.33333333',
    timezones: [
      {
        zoneName: 'Pacific/Apia',
        gmtOffset: 50400,
        gmtOffsetName: 'UTC+14:00',
        abbreviation: 'WST',
        tzName: 'West Samoa Time'
      }
    ]
  },
  {
    isoCode: 'SM',
    name: 'San Marino',
    phonecode: '378',
    flag: '🇸🇲',
    currency: 'EUR',
    latitude: '43.76666666',
    longitude: '12.41666666',
    timezones: [
      {
        zoneName: 'Europe/San_Marino',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'ST',
    name: 'Sao Tome and Principe',
    phonecode: '239',
    flag: '🇸🇹',
    currency: 'STD',
    latitude: '1.00000000',
    longitude: '7.00000000',
    timezones: [
      {
        zoneName: 'Africa/Sao_Tome',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'SA',
    name: 'Saudi Arabia',
    phonecode: '966',
    flag: '🇸🇦',
    currency: 'SAR',
    latitude: '25.00000000',
    longitude: '45.00000000',
    timezones: [
      {
        zoneName: 'Asia/Riyadh',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'AST',
        tzName: 'Arabia Standard Time'
      }
    ]
  },
  {
    isoCode: 'SN',
    name: 'Senegal',
    phonecode: '221',
    flag: '🇸🇳',
    currency: 'XOF',
    latitude: '14.00000000',
    longitude: '-14.00000000',
    timezones: [
      {
        zoneName: 'Africa/Dakar',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'RS',
    name: 'Serbia',
    phonecode: '381',
    flag: '🇷🇸',
    currency: 'RSD',
    latitude: '44.00000000',
    longitude: '21.00000000',
    timezones: [
      {
        zoneName: 'Europe/Belgrade',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'SC',
    name: 'Seychelles',
    phonecode: '248',
    flag: '🇸🇨',
    currency: 'SCR',
    latitude: '-4.58333333',
    longitude: '55.66666666',
    timezones: [
      {
        zoneName: 'Indian/Mahe',
        gmtOffset: 14400,
        gmtOffsetName: 'UTC+04:00',
        abbreviation: 'SCT',
        tzName: 'Seychelles Time'
      }
    ]
  },
  {
    isoCode: 'SL',
    name: 'Sierra Leone',
    phonecode: '232',
    flag: '🇸🇱',
    currency: 'SLL',
    latitude: '8.50000000',
    longitude: '-11.50000000',
    timezones: [
      {
        zoneName: 'Africa/Freetown',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'SG',
    name: 'Singapore',
    phonecode: '65',
    flag: '🇸🇬',
    currency: 'SGD',
    latitude: '1.36666666',
    longitude: '103.80000000',
    timezones: [
      {
        zoneName: 'Asia/Singapore',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'SGT',
        tzName: 'Singapore Time'
      }
    ]
  },
  {
    isoCode: 'SK',
    name: 'Slovakia',
    phonecode: '421',
    flag: '🇸🇰',
    currency: 'EUR',
    latitude: '48.66666666',
    longitude: '19.50000000',
    timezones: [
      {
        zoneName: 'Europe/Bratislava',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'SI',
    name: 'Slovenia',
    phonecode: '386',
    flag: '🇸🇮',
    currency: 'EUR',
    latitude: '46.11666666',
    longitude: '14.81666666',
    timezones: [
      {
        zoneName: 'Europe/Ljubljana',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'SB',
    name: 'Solomon Islands',
    phonecode: '677',
    flag: '🇸🇧',
    currency: 'SBD',
    latitude: '-8.00000000',
    longitude: '159.00000000',
    timezones: [
      {
        zoneName: 'Pacific/Guadalcanal',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'SBT',
        tzName: 'Solomon Islands Time'
      }
    ]
  },
  {
    isoCode: 'SO',
    name: 'Somalia',
    phonecode: '252',
    flag: '🇸🇴',
    currency: 'SOS',
    latitude: '10.00000000',
    longitude: '49.00000000',
    timezones: [
      {
        zoneName: 'Africa/Mogadishu',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'EAT',
        tzName: 'East Africa Time'
      }
    ]
  },
  {
    isoCode: 'ZA',
    name: 'South Africa',
    phonecode: '27',
    flag: '🇿🇦',
    currency: 'ZAR',
    latitude: '-29.00000000',
    longitude: '24.00000000',
    timezones: [
      {
        zoneName: 'Africa/Johannesburg',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'SAST',
        tzName: 'South African Standard Time'
      }
    ]
  },
  {
    isoCode: 'GS',
    name: 'South Georgia',
    phonecode: '',
    flag: '🇬🇸',
    currency: 'GBP',
    latitude: '-54.50000000',
    longitude: '-37.00000000',
    timezones: [
      {
        zoneName: 'Atlantic/South_Georgia',
        gmtOffset: -7200,
        gmtOffsetName: 'UTC-02:00',
        abbreviation: 'GST',
        tzName: 'South Georgia and the South Sandwich Islands Time'
      }
    ]
  },
  {
    isoCode: 'SS',
    name: 'South Sudan',
    phonecode: '211',
    flag: '🇸🇸',
    currency: 'SSP',
    latitude: '7.00000000',
    longitude: '30.00000000',
    timezones: [
      {
        zoneName: 'Africa/Juba',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'EAT',
        tzName: 'East Africa Time'
      }
    ]
  },
  {
    isoCode: 'ES',
    name: 'Spain',
    phonecode: '34',
    flag: '🇪🇸',
    currency: 'EUR',
    latitude: '40.00000000',
    longitude: '-4.00000000',
    timezones: [
      {
        zoneName: 'Africa/Ceuta',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      },
      {
        zoneName: 'Atlantic/Canary',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'WET',
        tzName: 'Western European Time'
      },
      {
        zoneName: 'Europe/Madrid',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'LK',
    name: 'Sri Lanka',
    phonecode: '94',
    flag: '🇱🇰',
    currency: 'LKR',
    latitude: '7.00000000',
    longitude: '81.00000000',
    timezones: [
      {
        zoneName: 'Asia/Colombo',
        gmtOffset: 19800,
        gmtOffsetName: 'UTC+05:30',
        abbreviation: 'IST',
        tzName: 'Indian Standard Time'
      }
    ]
  },
  {
    isoCode: 'SD',
    name: 'Sudan',
    phonecode: '249',
    flag: '🇸🇩',
    currency: 'SDG',
    latitude: '15.00000000',
    longitude: '30.00000000',
    timezones: [
      {
        zoneName: 'Africa/Khartoum',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EAT',
        tzName: 'Eastern African Time'
      }
    ]
  },
  {
    isoCode: 'SR',
    name: 'Suriname',
    phonecode: '597',
    flag: '🇸🇷',
    currency: 'SRD',
    latitude: '4.00000000',
    longitude: '-56.00000000',
    timezones: [
      {
        zoneName: 'America/Paramaribo',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'SRT',
        tzName: 'Suriname Time'
      }
    ]
  },
  {
    isoCode: 'SJ',
    name: 'Svalbard And Jan Mayen Islands',
    phonecode: '47',
    flag: '🇸🇯',
    currency: 'NOK',
    latitude: '78.00000000',
    longitude: '20.00000000',
    timezones: [
      {
        zoneName: 'Arctic/Longyearbyen',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'SZ',
    name: 'Swaziland',
    phonecode: '268',
    flag: '🇸🇿',
    currency: 'SZL',
    latitude: '-26.50000000',
    longitude: '31.50000000',
    timezones: [
      {
        zoneName: 'Africa/Mbabane',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'SAST',
        tzName: 'South African Standard Time'
      }
    ]
  },
  {
    isoCode: 'SE',
    name: 'Sweden',
    phonecode: '46',
    flag: '🇸🇪',
    currency: 'SEK',
    latitude: '62.00000000',
    longitude: '15.00000000',
    timezones: [
      {
        zoneName: 'Europe/Stockholm',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'CH',
    name: 'Switzerland',
    phonecode: '41',
    flag: '🇨🇭',
    currency: 'CHF',
    latitude: '47.00000000',
    longitude: '8.00000000',
    timezones: [
      {
        zoneName: 'Europe/Zurich',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'SY',
    name: 'Syria',
    phonecode: '963',
    flag: '🇸🇾',
    currency: 'SYP',
    latitude: '35.00000000',
    longitude: '38.00000000',
    timezones: [
      {
        zoneName: 'Asia/Damascus',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'TW',
    name: 'Taiwan',
    phonecode: '886',
    flag: '🇹🇼',
    currency: 'TWD',
    latitude: '23.50000000',
    longitude: '121.00000000',
    timezones: [
      {
        zoneName: 'Asia/Taipei',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'CST',
        tzName: 'China Standard Time'
      }
    ]
  },
  {
    isoCode: 'TJ',
    name: 'Tajikistan',
    phonecode: '992',
    flag: '🇹🇯',
    currency: 'TJS',
    latitude: '39.00000000',
    longitude: '71.00000000',
    timezones: [
      {
        zoneName: 'Asia/Dushanbe',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'TJT',
        tzName: 'Tajikistan Time'
      }
    ]
  },
  {
    isoCode: 'TZ',
    name: 'Tanzania',
    phonecode: '255',
    flag: '🇹🇿',
    currency: 'TZS',
    latitude: '-6.00000000',
    longitude: '35.00000000',
    timezones: [
      {
        zoneName: 'Africa/Dar_es_Salaam',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'EAT',
        tzName: 'East Africa Time'
      }
    ]
  },
  {
    isoCode: 'TH',
    name: 'Thailand',
    phonecode: '66',
    flag: '🇹🇭',
    currency: 'THB',
    latitude: '15.00000000',
    longitude: '100.00000000',
    timezones: [
      {
        zoneName: 'Asia/Bangkok',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'ICT',
        tzName: 'Indochina Time'
      }
    ]
  },
  {
    isoCode: 'TG',
    name: 'Togo',
    phonecode: '228',
    flag: '🇹🇬',
    currency: 'XOF',
    latitude: '8.00000000',
    longitude: '1.16666666',
    timezones: [
      {
        zoneName: 'Africa/Lome',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'TK',
    name: 'Tokelau',
    phonecode: '690',
    flag: '🇹🇰',
    currency: 'NZD',
    latitude: '-9.00000000',
    longitude: '-172.00000000',
    timezones: [
      {
        zoneName: 'Pacific/Fakaofo',
        gmtOffset: 46800,
        gmtOffsetName: 'UTC+13:00',
        abbreviation: 'TKT',
        tzName: 'Tokelau Time'
      }
    ]
  },
  {
    isoCode: 'TO',
    name: 'Tonga',
    phonecode: '676',
    flag: '🇹🇴',
    currency: 'TOP',
    latitude: '-20.00000000',
    longitude: '-175.00000000',
    timezones: [
      {
        zoneName: 'Pacific/Tongatapu',
        gmtOffset: 46800,
        gmtOffsetName: 'UTC+13:00',
        abbreviation: 'TOT',
        tzName: 'Tonga Time'
      }
    ]
  },
  {
    isoCode: 'TT',
    name: 'Trinidad And Tobago',
    phonecode: '+1-868',
    flag: '🇹🇹',
    currency: 'TTD',
    latitude: '11.00000000',
    longitude: '-61.00000000',
    timezones: [
      {
        zoneName: 'America/Port_of_Spain',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'TN',
    name: 'Tunisia',
    phonecode: '216',
    flag: '🇹🇳',
    currency: 'TND',
    latitude: '34.00000000',
    longitude: '9.00000000',
    timezones: [
      {
        zoneName: 'Africa/Tunis',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'TR',
    name: 'Turkey',
    phonecode: '90',
    flag: '🇹🇷',
    currency: 'TRY',
    latitude: '39.00000000',
    longitude: '35.00000000',
    timezones: [
      {
        zoneName: 'Europe/Istanbul',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'TM',
    name: 'Turkmenistan',
    phonecode: '993',
    flag: '🇹🇲',
    currency: 'TMT',
    latitude: '40.00000000',
    longitude: '60.00000000',
    timezones: [
      {
        zoneName: 'Asia/Ashgabat',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'TMT',
        tzName: 'Turkmenistan Time'
      }
    ]
  },
  {
    isoCode: 'TC',
    name: 'Turks And Caicos Islands',
    phonecode: '+1-649',
    flag: '🇹🇨',
    currency: 'USD',
    latitude: '21.75000000',
    longitude: '-71.58333333',
    timezones: [
      {
        zoneName: 'America/Grand_Turk',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      }
    ]
  },
  {
    isoCode: 'TV',
    name: 'Tuvalu',
    phonecode: '688',
    flag: '🇹🇻',
    currency: 'AUD',
    latitude: '-8.00000000',
    longitude: '178.00000000',
    timezones: [
      {
        zoneName: 'Pacific/Funafuti',
        gmtOffset: 43200,
        gmtOffsetName: 'UTC+12:00',
        abbreviation: 'TVT',
        tzName: 'Tuvalu Time'
      }
    ]
  },
  {
    isoCode: 'UG',
    name: 'Uganda',
    phonecode: '256',
    flag: '🇺🇬',
    currency: 'UGX',
    latitude: '1.00000000',
    longitude: '32.00000000',
    timezones: [
      {
        zoneName: 'Africa/Kampala',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'EAT',
        tzName: 'East Africa Time'
      }
    ]
  },
  {
    isoCode: 'UA',
    name: 'Ukraine',
    phonecode: '380',
    flag: '🇺🇦',
    currency: 'UAH',
    latitude: '49.00000000',
    longitude: '32.00000000',
    timezones: [
      {
        zoneName: 'Europe/Kiev',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      },
      {
        zoneName: 'Europe/Simferopol',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'MSK',
        tzName: 'Moscow Time'
      },
      {
        zoneName: 'Europe/Uzhgorod',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      },
      {
        zoneName: 'Europe/Zaporozhye',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'EET',
        tzName: 'Eastern European Time'
      }
    ]
  },
  {
    isoCode: 'AE',
    name: 'United Arab Emirates',
    phonecode: '971',
    flag: '🇦🇪',
    currency: 'AED',
    latitude: '24.00000000',
    longitude: '54.00000000',
    timezones: [
      {
        zoneName: 'Asia/Dubai',
        gmtOffset: 14400,
        gmtOffsetName: 'UTC+04:00',
        abbreviation: 'GST',
        tzName: 'Gulf Standard Time'
      }
    ]
  },
  {
    isoCode: 'GB',
    name: 'United Kingdom',
    phonecode: '44',
    flag: '🇬🇧',
    currency: 'GBP',
    latitude: '54.00000000',
    longitude: '-2.00000000',
    timezones: [
      {
        zoneName: 'Europe/London',
        gmtOffset: 0,
        gmtOffsetName: 'UTC±00',
        abbreviation: 'GMT',
        tzName: 'Greenwich Mean Time'
      }
    ]
  },
  {
    isoCode: 'US',
    name: 'United States',
    phonecode: '1',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: '38.00000000',
    longitude: '-97.00000000',
    timezones: [
      {
        zoneName: 'America/Adak',
        gmtOffset: -36000,
        gmtOffsetName: 'UTC-10:00',
        abbreviation: 'HST',
        tzName: 'Hawaii–Aleutian Standard Time'
      },
      {
        zoneName: 'America/Anchorage',
        gmtOffset: -32400,
        gmtOffsetName: 'UTC-09:00',
        abbreviation: 'AKST',
        tzName: 'Alaska Standard Time'
      },
      {
        zoneName: 'America/Boise',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America'
      },
      {
        zoneName: 'America/Chicago',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Denver',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America'
      },
      {
        zoneName: 'America/Detroit',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Indiana/Indianapolis',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Indiana/Knox',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Indiana/Marengo',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Indiana/Petersburg',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Indiana/Tell_City',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Indiana/Vevay',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Indiana/Vincennes',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Indiana/Winamac',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Juneau',
        gmtOffset: -32400,
        gmtOffsetName: 'UTC-09:00',
        abbreviation: 'AKST',
        tzName: 'Alaska Standard Time'
      },
      {
        zoneName: 'America/Kentucky/Louisville',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Kentucky/Monticello',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Los_Angeles',
        gmtOffset: -28800,
        gmtOffsetName: 'UTC-08:00',
        abbreviation: 'PST',
        tzName: 'Pacific Standard Time (North America'
      },
      {
        zoneName: 'America/Menominee',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Metlakatla',
        gmtOffset: -32400,
        gmtOffsetName: 'UTC-09:00',
        abbreviation: 'AKST',
        tzName: 'Alaska Standard Time'
      },
      {
        zoneName: 'America/New_York',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'EST',
        tzName: 'Eastern Standard Time (North America'
      },
      {
        zoneName: 'America/Nome',
        gmtOffset: -32400,
        gmtOffsetName: 'UTC-09:00',
        abbreviation: 'AKST',
        tzName: 'Alaska Standard Time'
      },
      {
        zoneName: 'America/North_Dakota/Beulah',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/North_Dakota/Center',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/North_Dakota/New_Salem',
        gmtOffset: -21600,
        gmtOffsetName: 'UTC-06:00',
        abbreviation: 'CST',
        tzName: 'Central Standard Time (North America'
      },
      {
        zoneName: 'America/Phoenix',
        gmtOffset: -25200,
        gmtOffsetName: 'UTC-07:00',
        abbreviation: 'MST',
        tzName: 'Mountain Standard Time (North America'
      },
      {
        zoneName: 'America/Sitka',
        gmtOffset: -32400,
        gmtOffsetName: 'UTC-09:00',
        abbreviation: 'AKST',
        tzName: 'Alaska Standard Time'
      },
      {
        zoneName: 'America/Yakutat',
        gmtOffset: -32400,
        gmtOffsetName: 'UTC-09:00',
        abbreviation: 'AKST',
        tzName: 'Alaska Standard Time'
      },
      {
        zoneName: 'Pacific/Honolulu',
        gmtOffset: -36000,
        gmtOffsetName: 'UTC-10:00',
        abbreviation: 'HST',
        tzName: 'Hawaii–Aleutian Standard Time'
      }
    ]
  },
  {
    isoCode: 'UM',
    name: 'United States Minor Outlying Islands',
    phonecode: '1',
    flag: '🇺🇲',
    currency: 'USD',
    latitude: '0.00000000',
    longitude: '0.00000000',
    timezones: [
      {
        zoneName: 'Pacific/Midway',
        gmtOffset: -39600,
        gmtOffsetName: 'UTC-11:00',
        abbreviation: 'SST',
        tzName: 'Samoa Standard Time'
      },
      {
        zoneName: 'Pacific/Wake',
        gmtOffset: 43200,
        gmtOffsetName: 'UTC+12:00',
        abbreviation: 'WAKT',
        tzName: 'Wake Island Time'
      }
    ]
  },
  {
    isoCode: 'UY',
    name: 'Uruguay',
    phonecode: '598',
    flag: '🇺🇾',
    currency: 'UYU',
    latitude: '-33.00000000',
    longitude: '-56.00000000',
    timezones: [
      {
        zoneName: 'America/Montevideo',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'UYT',
        tzName: 'Uruguay Standard Time'
      }
    ]
  },
  {
    isoCode: 'UZ',
    name: 'Uzbekistan',
    phonecode: '998',
    flag: '🇺🇿',
    currency: 'UZS',
    latitude: '41.00000000',
    longitude: '64.00000000',
    timezones: [
      {
        zoneName: 'Asia/Samarkand',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'UZT',
        tzName: 'Uzbekistan Time'
      },
      {
        zoneName: 'Asia/Tashkent',
        gmtOffset: 18000,
        gmtOffsetName: 'UTC+05:00',
        abbreviation: 'UZT',
        tzName: 'Uzbekistan Time'
      }
    ]
  },
  {
    isoCode: 'VU',
    name: 'Vanuatu',
    phonecode: '678',
    flag: '🇻🇺',
    currency: 'VUV',
    latitude: '-16.00000000',
    longitude: '167.00000000',
    timezones: [
      {
        zoneName: 'Pacific/Efate',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'VUT',
        tzName: 'Vanuatu Time'
      }
    ]
  },
  {
    isoCode: 'VA',
    name: 'Vatican City State (Holy See)',
    phonecode: '379',
    flag: '🇻🇦',
    currency: 'EUR',
    latitude: '41.90000000',
    longitude: '12.45000000',
    timezones: [
      {
        zoneName: 'Europe/Vatican',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'VE',
    name: 'Venezuela',
    phonecode: '58',
    flag: '🇻🇪',
    currency: 'VEF',
    latitude: '8.00000000',
    longitude: '-66.00000000',
    timezones: [
      {
        zoneName: 'America/Caracas',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'VET',
        tzName: 'Venezuelan Standard Time'
      }
    ]
  },
  {
    isoCode: 'VN',
    name: 'Vietnam',
    phonecode: '84',
    flag: '🇻🇳',
    currency: 'VND',
    latitude: '16.16666666',
    longitude: '107.83333333',
    timezones: [
      {
        zoneName: 'Asia/Ho_Chi_Minh',
        gmtOffset: 25200,
        gmtOffsetName: 'UTC+07:00',
        abbreviation: 'ICT',
        tzName: 'Indochina Time'
      }
    ]
  },
  {
    isoCode: 'VG',
    name: 'Virgin Islands (British)',
    phonecode: '+1-284',
    flag: '🇻🇬',
    currency: 'USD',
    latitude: '18.43138300',
    longitude: '-64.62305000',
    timezones: [
      {
        zoneName: 'America/Tortola',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'VI',
    name: 'Virgin Islands (US)',
    phonecode: '+1-340',
    flag: '🇻🇮',
    currency: 'USD',
    latitude: '18.34000000',
    longitude: '-64.93000000',
    timezones: [
      {
        zoneName: 'America/St_Thomas',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'WF',
    name: 'Wallis And Futuna Islands',
    phonecode: '681',
    flag: '🇼🇫',
    currency: 'XPF',
    latitude: '-13.30000000',
    longitude: '-176.20000000',
    timezones: [
      {
        zoneName: 'Pacific/Wallis',
        gmtOffset: 43200,
        gmtOffsetName: 'UTC+12:00',
        abbreviation: 'WFT',
        tzName: 'Wallis & Futuna Time'
      }
    ]
  },
  {
    isoCode: 'EH',
    name: 'Western Sahara',
    phonecode: '212',
    flag: '🇪🇭',
    currency: 'MAD',
    latitude: '24.50000000',
    longitude: '-13.00000000',
    timezones: [
      {
        zoneName: 'Africa/El_Aaiun',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'WEST',
        tzName: 'Western European Summer Time'
      }
    ]
  },
  {
    isoCode: 'YE',
    name: 'Yemen',
    phonecode: '967',
    flag: '🇾🇪',
    currency: 'YER',
    latitude: '15.00000000',
    longitude: '48.00000000',
    timezones: [
      {
        zoneName: 'Asia/Aden',
        gmtOffset: 10800,
        gmtOffsetName: 'UTC+03:00',
        abbreviation: 'AST',
        tzName: 'Arabia Standard Time'
      }
    ]
  },
  {
    isoCode: 'ZM',
    name: 'Zambia',
    phonecode: '260',
    flag: '🇿🇲',
    currency: 'ZMW',
    latitude: '-15.00000000',
    longitude: '30.00000000',
    timezones: [
      {
        zoneName: 'Africa/Lusaka',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'CAT',
        tzName: 'Central Africa Time'
      }
    ]
  },
  {
    isoCode: 'ZW',
    name: 'Zimbabwe',
    phonecode: '263',
    flag: '🇿🇼',
    currency: 'ZWL',
    latitude: '-20.00000000',
    longitude: '30.00000000',
    timezones: [
      {
        zoneName: 'Africa/Harare',
        gmtOffset: 7200,
        gmtOffsetName: 'UTC+02:00',
        abbreviation: 'CAT',
        tzName: 'Central Africa Time'
      }
    ]
  },
  {
    isoCode: 'XK',
    name: 'Kosovo',
    phonecode: '383',
    flag: '🇽🇰',
    currency: 'EUR',
    latitude: '42.56129090',
    longitude: '20.34030350',
    timezones: [
      {
        zoneName: 'Europe/Belgrade',
        gmtOffset: 3600,
        gmtOffsetName: 'UTC+01:00',
        abbreviation: 'CET',
        tzName: 'Central European Time'
      }
    ]
  },
  {
    isoCode: 'CW',
    name: 'Curaçao',
    phonecode: '599',
    flag: '🇨🇼',
    currency: 'ANG',
    latitude: '12.11666700',
    longitude: '-68.93333300',
    timezones: [
      {
        zoneName: 'America/Curacao',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  },
  {
    isoCode: 'SX',
    name: 'Sint Maarten (Dutch part)',
    phonecode: '1721',
    flag: '🇸🇽',
    currency: 'ANG',
    latitude: '18.03333300',
    longitude: '-63.05000000',
    timezones: [
      {
        zoneName: 'America/Anguilla',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AST',
        tzName: 'Atlantic Standard Time'
      }
    ]
  }
];

const isoCodes = COUNTRIES.map(c => {
  return { text: c.name, value: c.isoCode };
});

const phoneCodes = COUNTRIES.map(c => {
  return { text: `${c.name} (+${c.phonecode})`, value: c.phonecode };
});

export const countries = {
  COUNTRIES,
  isoCodes,
  phoneCodes
};
