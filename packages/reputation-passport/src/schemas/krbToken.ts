export const krbToken = {
  polygon: {
    contractName: 'Krebit',
    symbol: 'KRB',
    token: 'MATIC',
    name: 'Polygon',
    address: '0xdEb4810c8AB3f9De3F253064A40b1D0c8703fbbf',
    block: 34019942,
    network: 'matic',
    blockUrl: 'https://polygonscan.com/',
    txUrl: 'https://polygonscan.com/tx/',
    addressUrl: 'https://polygonscan.com/address/',
    domain: {
      name: 'Krebit',
      version: '1.0',
      chainId: 137,
      verifyingContract: '0xdEb4810c8AB3f9De3F253064A40b1D0c8703fbbf'
    }
  },
  matic: {
    contractName: 'Krebit',
    symbol: 'KRB',
    token: 'MATIC',
    name: 'Polygon',
    address: '0xdEb4810c8AB3f9De3F253064A40b1D0c8703fbbf',
    block: 34019942,
    network: 'matic',
    blockUrl: 'https://polygonscan.com/',
    txUrl: 'https://polygonscan.com/tx/',
    addressUrl: 'https://polygonscan.com/address/',
    domain: {
      name: 'Krebit',
      version: '1.0',
      chainId: 137,
      verifyingContract: '0xdEb4810c8AB3f9De3F253064A40b1D0c8703fbbf'
    }
  },
  mumbai: {
    contractName: 'Krebit',
    symbol: 'KRB',
    token: 'MATIC',
    name: 'Polygon Testnet',
    address: '0x3210e026f93ed87B51b9798012727df6C8C9bAaA',
    block: 28447491,
    network: 'mumbai',
    blockUrl: 'https://mumbai.polygonscan.com/',
    txUrl: 'https://mumbai.polygonscan.com/tx/',
    addressUrl: 'https://mumbai.polygonscan.com/address/',
    domain: {
      name: 'Krebit',
      version: '1.0',
      chainId: 80001,
      verifyingContract: '0x3210e026f93ed87B51b9798012727df6C8C9bAaA'
    }
  },
  abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'previousAdmin',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'newAdmin',
          type: 'address'
        }
      ],
      name: 'AdminChanged',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256'
        }
      ],
      name: 'Approval',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'beacon',
          type: 'address'
        }
      ],
      name: 'BeaconUpgraded',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'uuid',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'reason',
          type: 'string'
        }
      ],
      name: 'Deleted',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'uuid',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'disputedBy',
          type: 'uint256'
        }
      ],
      name: 'Disputed',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'uuid',
          type: 'uint256'
        }
      ],
      name: 'Expired',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint8',
          name: 'version',
          type: 'uint8'
        }
      ],
      name: 'Initialized',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'uuid',
          type: 'uint256'
        },
        {
          components: [
            {
              internalType: 'string',
              name: '_context',
              type: 'string'
            },
            {
              internalType: 'string',
              name: '_type',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'id',
              type: 'string'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                }
              ],
              internalType: 'struct VCTypes.Issuer',
              name: 'issuer',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'typeSchema',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'value',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'encrypted',
                  type: 'string'
                },
                {
                  internalType: 'uint8',
                  name: 'trust',
                  type: 'uint8'
                },
                {
                  internalType: 'uint256',
                  name: 'stake',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'price',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'nbf',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'exp',
                  type: 'uint256'
                }
              ],
              internalType: 'struct VCTypes.CredentialSubject',
              name: 'credentialSubject',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                }
              ],
              internalType: 'struct VCTypes.CredentialSchema',
              name: 'credentialSchema',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'issuanceDate',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'expirationDate',
              type: 'string'
            }
          ],
          indexed: false,
          internalType: 'struct VCTypes.VerifiableCredential',
          name: 'vc',
          type: 'tuple'
        }
      ],
      name: 'Issued',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'Paused',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'uuid',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'reason',
          type: 'string'
        }
      ],
      name: 'Revoked',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32'
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32'
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32'
        }
      ],
      name: 'RoleAdminChanged',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address'
        }
      ],
      name: 'RoleGranted',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address'
        }
      ],
      name: 'RoleRevoked',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256'
        }
      ],
      name: 'Staked',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'uuid',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'reason',
          type: 'string'
        }
      ],
      name: 'Suspended',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256'
        }
      ],
      name: 'Transfer',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'Unpaused',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [],
      name: 'Updated',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'implementation',
          type: 'address'
        }
      ],
      name: 'Upgraded',
      type: 'event'
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'DEPOSITOR_ROLE',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'DOMAIN_SEPARATOR',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'GOVERN_ROLE',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address'
        },
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        }
      ],
      name: 'allowance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'approve',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'burn',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'burnFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'issuer',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'stake',
          type: 'uint256'
        }
      ],
      name: 'burnStake',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          internalType: 'uint8',
          name: '',
          type: 'uint8'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'subtractedValue',
          type: 'uint256'
        }
      ],
      name: 'decreaseAllowance',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: 'string',
              name: '_context',
              type: 'string'
            },
            {
              internalType: 'string',
              name: '_type',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'id',
              type: 'string'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                }
              ],
              internalType: 'struct VCTypes.Issuer',
              name: 'issuer',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'typeSchema',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'value',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'encrypted',
                  type: 'string'
                },
                {
                  internalType: 'uint8',
                  name: 'trust',
                  type: 'uint8'
                },
                {
                  internalType: 'uint256',
                  name: 'stake',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'price',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'nbf',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'exp',
                  type: 'uint256'
                }
              ],
              internalType: 'struct VCTypes.CredentialSubject',
              name: 'credentialSubject',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                }
              ],
              internalType: 'struct VCTypes.CredentialSchema',
              name: 'credentialSchema',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'issuanceDate',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'expirationDate',
              type: 'string'
            }
          ],
          internalType: 'struct VCTypes.VerifiableCredential',
          name: 'vc',
          type: 'tuple'
        },
        {
          internalType: 'string',
          name: 'reason',
          type: 'string'
        }
      ],
      name: 'deleteVC',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'user',
          type: 'address'
        },
        {
          internalType: 'bytes',
          name: 'depositData',
          type: 'bytes'
        }
      ],
      name: 'deposit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: 'string',
              name: '_context',
              type: 'string'
            },
            {
              internalType: 'string',
              name: '_type',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'id',
              type: 'string'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                }
              ],
              internalType: 'struct VCTypes.Issuer',
              name: 'issuer',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'typeSchema',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'value',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'encrypted',
                  type: 'string'
                },
                {
                  internalType: 'uint8',
                  name: 'trust',
                  type: 'uint8'
                },
                {
                  internalType: 'uint256',
                  name: 'stake',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'price',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'nbf',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'exp',
                  type: 'uint256'
                }
              ],
              internalType: 'struct VCTypes.CredentialSubject',
              name: 'credentialSubject',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                }
              ],
              internalType: 'struct VCTypes.CredentialSchema',
              name: 'credentialSchema',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'issuanceDate',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'expirationDate',
              type: 'string'
            }
          ],
          internalType: 'struct VCTypes.VerifiableCredential',
          name: 'vc',
          type: 'tuple'
        },
        {
          components: [
            {
              internalType: 'string',
              name: '_context',
              type: 'string'
            },
            {
              internalType: 'string',
              name: '_type',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'id',
              type: 'string'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                }
              ],
              internalType: 'struct VCTypes.Issuer',
              name: 'issuer',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'typeSchema',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'value',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'encrypted',
                  type: 'string'
                },
                {
                  internalType: 'uint8',
                  name: 'trust',
                  type: 'uint8'
                },
                {
                  internalType: 'uint256',
                  name: 'stake',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'price',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'nbf',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'exp',
                  type: 'uint256'
                }
              ],
              internalType: 'struct VCTypes.CredentialSubject',
              name: 'credentialSubject',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                }
              ],
              internalType: 'struct VCTypes.CredentialSchema',
              name: 'credentialSchema',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'issuanceDate',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'expirationDate',
              type: 'string'
            }
          ],
          internalType: 'struct VCTypes.VerifiableCredential',
          name: 'disputeVC',
          type: 'tuple'
        }
      ],
      name: 'disputeVCByGovern',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: 'string',
              name: '_context',
              type: 'string'
            },
            {
              internalType: 'string',
              name: '_type',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'id',
              type: 'string'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                }
              ],
              internalType: 'struct VCTypes.Issuer',
              name: 'issuer',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'typeSchema',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'value',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'encrypted',
                  type: 'string'
                },
                {
                  internalType: 'uint8',
                  name: 'trust',
                  type: 'uint8'
                },
                {
                  internalType: 'uint256',
                  name: 'stake',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'price',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'nbf',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'exp',
                  type: 'uint256'
                }
              ],
              internalType: 'struct VCTypes.CredentialSubject',
              name: 'credentialSubject',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                }
              ],
              internalType: 'struct VCTypes.CredentialSchema',
              name: 'credentialSchema',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'issuanceDate',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'expirationDate',
              type: 'string'
            }
          ],
          internalType: 'struct VCTypes.VerifiableCredential',
          name: 'vc',
          type: 'tuple'
        }
      ],
      name: 'expiredVC',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'feePercentage',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'feesAvailableForWithdraw',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32'
        }
      ],
      name: 'getRoleAdmin',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32'
        },
        {
          internalType: 'uint256',
          name: 'index',
          type: 'uint256'
        }
      ],
      name: 'getRoleMember',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32'
        }
      ],
      name: 'getRoleMemberCount',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: 'string',
              name: '_context',
              type: 'string'
            },
            {
              internalType: 'string',
              name: '_type',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'id',
              type: 'string'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                }
              ],
              internalType: 'struct VCTypes.Issuer',
              name: 'issuer',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'typeSchema',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'value',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'encrypted',
                  type: 'string'
                },
                {
                  internalType: 'uint8',
                  name: 'trust',
                  type: 'uint8'
                },
                {
                  internalType: 'uint256',
                  name: 'stake',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'price',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'nbf',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'exp',
                  type: 'uint256'
                }
              ],
              internalType: 'struct VCTypes.CredentialSubject',
              name: 'credentialSubject',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                }
              ],
              internalType: 'struct VCTypes.CredentialSchema',
              name: 'credentialSchema',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'issuanceDate',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'expirationDate',
              type: 'string'
            }
          ],
          internalType: 'struct VCTypes.VerifiableCredential',
          name: 'vc',
          type: 'tuple'
        }
      ],
      name: 'getUuid',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'pure',
      type: 'function'
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: 'string',
              name: '_context',
              type: 'string'
            },
            {
              internalType: 'string',
              name: '_type',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'id',
              type: 'string'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                }
              ],
              internalType: 'struct VCTypes.Issuer',
              name: 'issuer',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'typeSchema',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'value',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'encrypted',
                  type: 'string'
                },
                {
                  internalType: 'uint8',
                  name: 'trust',
                  type: 'uint8'
                },
                {
                  internalType: 'uint256',
                  name: 'stake',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'price',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'nbf',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'exp',
                  type: 'uint256'
                }
              ],
              internalType: 'struct VCTypes.CredentialSubject',
              name: 'credentialSubject',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                }
              ],
              internalType: 'struct VCTypes.CredentialSchema',
              name: 'credentialSchema',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'issuanceDate',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'expirationDate',
              type: 'string'
            }
          ],
          internalType: 'struct VCTypes.VerifiableCredential',
          name: 'vc',
          type: 'tuple'
        }
      ],
      name: 'getVCStatus',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32'
        },
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32'
        },
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'hasRole',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'addedValue',
          type: 'uint256'
        }
      ],
      name: 'increaseAllowance',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'name',
          type: 'string'
        },
        {
          internalType: 'string',
          name: 'symbol',
          type: 'string'
        },
        {
          internalType: 'string',
          name: 'version',
          type: 'string'
        }
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'forwarder',
          type: 'address'
        }
      ],
      name: 'isTrustedForwarder',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'maxPriceToIssue',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'maxStakeToIssue',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'minBalanceToIssue',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'minBalanceToReceive',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'minBalanceToTransfer',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'minPriceToIssue',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'minStakeToIssue',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'to',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'mint',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'name',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'pause',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'paused',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'dest',
          type: 'address'
        }
      ],
      name: 'payments',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'proxiableUUID',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: 'string',
              name: '_context',
              type: 'string'
            },
            {
              internalType: 'string',
              name: '_type',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'id',
              type: 'string'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                }
              ],
              internalType: 'struct VCTypes.Issuer',
              name: 'issuer',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'typeSchema',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'value',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'encrypted',
                  type: 'string'
                },
                {
                  internalType: 'uint8',
                  name: 'trust',
                  type: 'uint8'
                },
                {
                  internalType: 'uint256',
                  name: 'stake',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'price',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'nbf',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'exp',
                  type: 'uint256'
                }
              ],
              internalType: 'struct VCTypes.CredentialSubject',
              name: 'credentialSubject',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                }
              ],
              internalType: 'struct VCTypes.CredentialSchema',
              name: 'credentialSchema',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'issuanceDate',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'expirationDate',
              type: 'string'
            }
          ],
          internalType: 'struct VCTypes.VerifiableCredential',
          name: 'vc',
          type: 'tuple'
        },
        {
          internalType: 'bytes',
          name: 'proofValue',
          type: 'bytes'
        }
      ],
      name: 'registerVC',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'payable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      name: 'registry',
      outputs: [
        {
          internalType: 'enum KRBToken.Status',
          name: 'credentialStatus',
          type: 'uint8'
        },
        {
          internalType: 'uint256',
          name: 'disputedBy',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32'
        },
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32'
        },
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: 'string',
              name: '_context',
              type: 'string'
            },
            {
              internalType: 'string',
              name: '_type',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'id',
              type: 'string'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                }
              ],
              internalType: 'struct VCTypes.Issuer',
              name: 'issuer',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'typeSchema',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'value',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'encrypted',
                  type: 'string'
                },
                {
                  internalType: 'uint8',
                  name: 'trust',
                  type: 'uint8'
                },
                {
                  internalType: 'uint256',
                  name: 'stake',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'price',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'nbf',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'exp',
                  type: 'uint256'
                }
              ],
              internalType: 'struct VCTypes.CredentialSubject',
              name: 'credentialSubject',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                }
              ],
              internalType: 'struct VCTypes.CredentialSchema',
              name: 'credentialSchema',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'issuanceDate',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'expirationDate',
              type: 'string'
            }
          ],
          internalType: 'struct VCTypes.VerifiableCredential',
          name: 'vc',
          type: 'tuple'
        },
        {
          internalType: 'string',
          name: 'reason',
          type: 'string'
        }
      ],
      name: 'revokeVC',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'issuer',
          type: 'address'
        }
      ],
      name: 'stakeOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'bytes4',
          name: 'interfaceId',
          type: 'bytes4'
        }
      ],
      name: 'supportsInterface',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: 'string',
              name: '_context',
              type: 'string'
            },
            {
              internalType: 'string',
              name: '_type',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'id',
              type: 'string'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                }
              ],
              internalType: 'struct VCTypes.Issuer',
              name: 'issuer',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'ethereumAddress',
                  type: 'address'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'typeSchema',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'value',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: 'encrypted',
                  type: 'string'
                },
                {
                  internalType: 'uint8',
                  name: 'trust',
                  type: 'uint8'
                },
                {
                  internalType: 'uint256',
                  name: 'stake',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'price',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'nbf',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'exp',
                  type: 'uint256'
                }
              ],
              internalType: 'struct VCTypes.CredentialSubject',
              name: 'credentialSubject',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'id',
                  type: 'string'
                },
                {
                  internalType: 'string',
                  name: '_type',
                  type: 'string'
                }
              ],
              internalType: 'struct VCTypes.CredentialSchema',
              name: 'credentialSchema',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'issuanceDate',
              type: 'string'
            },
            {
              internalType: 'string',
              name: 'expirationDate',
              type: 'string'
            }
          ],
          internalType: 'struct VCTypes.VerifiableCredential',
          name: 'vc',
          type: 'tuple'
        },
        {
          internalType: 'string',
          name: 'reason',
          type: 'string'
        }
      ],
      name: 'suspendVC',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'to',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'transfer',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'from',
          type: 'address'
        },
        {
          internalType: 'address',
          name: 'to',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'transferFrom',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'trustedForwarder',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'unpause',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'newMinBalanceToTransfer',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'newMinBalanceToReceive',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'newMinBalanceToIssue',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'newFeePercentage',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'newMinPrice',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'newMaxPrice',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'newMinStake',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'newMaxStake',
          type: 'uint256'
        },
        {
          internalType: 'address',
          name: 'newTrustedForwarder',
          type: 'address'
        }
      ],
      name: 'updateParameters',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newImplementation',
          type: 'address'
        }
      ],
      name: 'upgradeTo',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newImplementation',
          type: 'address'
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes'
        }
      ],
      name: 'upgradeToAndCall',
      outputs: [],
      stateMutability: 'payable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'signer',
          type: 'address'
        },
        {
          internalType: 'bytes32',
          name: 'structHash',
          type: 'bytes32'
        },
        {
          internalType: 'bytes',
          name: 'signature',
          type: 'bytes'
        }
      ],
      name: 'validateSignedData',
      outputs: [],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'withdraw',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address payable',
          name: '_to',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_amount',
          type: 'uint256'
        }
      ],
      name: 'withdrawFees',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address payable',
          name: 'payee',
          type: 'address'
        }
      ],
      name: 'withdrawPayments',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ]
};
