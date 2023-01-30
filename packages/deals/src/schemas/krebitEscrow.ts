export const krebitEscrow = {
  polygon: {
    contractName: 'Krebit Escrow',
    token: 'polygon',
    name: 'Polygon',
    address: '0x1Bb2B59BA70A8d42d2C0c1d62DBea7920BcbebF5',
    block: 34019949,
    network: 'polygon',
    blockUrl: 'https://polygonscan.com/',
    txUrl: 'https://polygonscan.com/tx/',
    addressUrl: 'https://polygonscan.com/address/'
  },
  mumbai: {
    contractName: 'Krebit Escrow',
    token: 'polygon',
    name: 'Polygon Testnet',
    address: '0x53FcC337D4619Bcd028EB811F5E1A0B23cf88BEd',
    block: 28447492,
    network: 'mumbai',
    blockUrl: 'https://mumbai.polygonscan.com/',
    txUrl: 'https://mumbai.polygonscan.com/tx/',
    addressUrl: 'https://mumbai.polygonscan.com/address/'
  },
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_krebitAddress',
          type: 'address'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bytes32',
          name: '_dealHash',
          type: 'bytes32'
        }
      ],
      name: 'BuyerCancelDisabled',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bytes32',
          name: '_dealHash',
          type: 'bytes32'
        }
      ],
      name: 'CancelledByBuyer',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bytes32',
          name: '_dealHash',
          type: 'bytes32'
        }
      ],
      name: 'CancelledBySeller',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bytes32',
          name: '_dealHash',
          type: 'bytes32'
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
          name: 'dealCredential',
          type: 'tuple'
        }
      ],
      name: 'Created',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bytes32',
          name: '_dealHash',
          type: 'bytes32'
        }
      ],
      name: 'DisputeResolved',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bytes32',
          name: '_dealHash',
          type: 'bytes32'
        }
      ],
      name: 'Released',
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
      inputs: [],
      name: 'Updated',
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
          internalType: 'contract ERC20',
          name: '_tokenContract',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_spender',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'approveToken',
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
          name: 'referralCredential',
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
          name: 'dealCredential',
          type: 'tuple'
        },
        {
          internalType: 'address payable',
          name: '_referrer',
          type: 'address'
        }
      ],
      name: 'buyerCancel',
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
          name: 'referralCredential',
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
          name: 'dealCredential',
          type: 'tuple'
        },
        {
          internalType: 'bytes',
          name: 'dealProof',
          type: 'bytes'
        }
      ],
      name: 'createEscrow',
      outputs: [],
      stateMutability: 'payable',
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
          name: 'dealCredential',
          type: 'tuple'
        }
      ],
      name: 'disableBuyerCancel',
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
          internalType: 'bytes32',
          name: '',
          type: 'bytes32'
        }
      ],
      name: 'escrows',
      outputs: [
        {
          internalType: 'enum KrebitEscrow.Status',
          name: 'dealStatus',
          type: 'uint8'
        },
        {
          internalType: 'uint256',
          name: 'buyerCanCancelAfter',
          type: 'uint256'
        },
        {
          internalType: 'bytes32',
          name: 'referral',
          type: 'bytes32'
        }
      ],
      stateMutability: 'view',
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
          name: 'dealCredential',
          type: 'tuple'
        }
      ],
      name: 'getDealStatus',
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
          name: 'dealCredential',
          type: 'tuple'
        }
      ],
      name: 'getUuid',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32'
        }
      ],
      stateMutability: 'pure',
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
      name: 'referralPercentage',
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
          name: 'referralCredential',
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
          name: 'dealCredential',
          type: 'tuple'
        },
        {
          internalType: 'address payable',
          name: '_referrer',
          type: 'address'
        }
      ],
      name: 'release',
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
          name: 'dealCredential',
          type: 'tuple'
        },
        {
          internalType: 'uint8',
          name: '_sellerPercent',
          type: 'uint8'
        }
      ],
      name: 'resolveDispute',
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
          name: 'referralCredential',
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
          name: 'dealCredential',
          type: 'tuple'
        },
        {
          internalType: 'address payable',
          name: '_referrer',
          type: 'address'
        }
      ],
      name: 'sellerCancel',
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
          internalType: 'uint256',
          name: 'newFeePercentage',
          type: 'uint256'
        }
      ],
      name: 'setFeePercentage',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'newReferralPercentage',
          type: 'uint256'
        }
      ],
      name: 'setReferralPercentage',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newTrustedForwarder',
          type: 'address'
        }
      ],
      name: 'setTrustedForwarder',
      outputs: [],
      stateMutability: 'nonpayable',
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
          internalType: 'contract ERC20',
          name: '_tokenContract',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_transferTo',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'transferToken',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'contract ERC20',
          name: '_tokenContract',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_transferTo',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_transferFrom',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'transferTokenFrom',
      outputs: [],
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
