/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/reclaim.json`.
 */
export type Reclaim = {
  "address": "EopRkEakcNd3kC7SZZKXqAHFx1ysXwcAsDW2ABhKAGpN",
  "metadata": {
    "name": "reclaim",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Reclaim Protocol SDK for Solana",
    "repository": "https://gitlab.reclaimprotocol.org/reclaim-clients/solana-sdk"
  },
  "instructions": [
    {
      "name": "addEpoch",
      "discriminator": [
        250,
        231,
        141,
        199,
        139,
        208,
        231,
        27
      ],
      "accounts": [
        {
          "name": "epoch",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "epochConfig"
              },
              {
                "kind": "const",
                "value": [
                  101,
                  112,
                  111,
                  99,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "epoch_config.epoch_index.checked_add(1)",
                "account": "epochConfig"
              }
            ]
          }
        },
        {
          "name": "epochConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "const",
                "value": [
                  101,
                  112,
                  111,
                  99,
                  104,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "epoch_config.create_key",
                "account": "epochConfig"
              }
            ]
          }
        },
        {
          "name": "rentPayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "deployer",
          "signer": true,
          "relations": [
            "epochConfig"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "addEpochArgs"
            }
          }
        }
      ]
    },
    {
      "name": "changeEpochIndexEpochConfig",
      "discriminator": [
        138,
        57,
        206,
        183,
        109,
        57,
        251,
        139
      ],
      "accounts": [
        {
          "name": "epochConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "const",
                "value": [
                  101,
                  112,
                  111,
                  99,
                  104,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "epoch_config.create_key",
                "account": "epochConfig"
              }
            ]
          }
        },
        {
          "name": "deployer",
          "writable": true,
          "signer": true,
          "relations": [
            "epochConfig"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "changeEpochIndexEpochConfigArgs"
            }
          }
        }
      ]
    },
    {
      "name": "createChallenge",
      "discriminator": [
        170,
        244,
        47,
        1,
        1,
        15,
        173,
        239
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "challenge",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  97,
                  108,
                  108,
                  101,
                  110,
                  103,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "challengeId"
              }
            ]
          }
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "creatorTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "programTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "challenge"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "challengeId",
          "type": "string"
        },
        {
          "name": "wagerAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createGroup",
      "discriminator": [
        79,
        60,
        158,
        134,
        61,
        199,
        56,
        248
      ],
      "accounts": [
        {
          "name": "group",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "const",
                "value": [
                  103,
                  114,
                  111,
                  117,
                  112
                ]
              },
              {
                "kind": "arg",
                "path": "args.provider"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createGroupArgs"
            }
          }
        }
      ]
    },
    {
      "name": "initializeEpochConfig",
      "discriminator": [
        224,
        171,
        134,
        64,
        85,
        90,
        160,
        246
      ],
      "accounts": [
        {
          "name": "epochConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "const",
                "value": [
                  101,
                  112,
                  111,
                  99,
                  104,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "createKey"
              }
            ]
          }
        },
        {
          "name": "createKey",
          "signer": true
        },
        {
          "name": "deployer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "initializeEpochConfigArgs"
            }
          }
        }
      ]
    },
    {
      "name": "joinChallenge",
      "discriminator": [
        41,
        104,
        214,
        73,
        32,
        168,
        76,
        79
      ],
      "accounts": [
        {
          "name": "opponent",
          "writable": true,
          "signer": true
        },
        {
          "name": "challenge",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  97,
                  108,
                  108,
                  101,
                  110,
                  103,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "challengeId"
              }
            ]
          }
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "opponentTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "opponent"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "programTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "challenge"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "challengeId",
          "type": "string"
        },
        {
          "name": "wagerAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "settleWager",
      "discriminator": [
        161,
        242,
        169,
        152,
        172,
        163,
        161,
        104
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "creator",
          "writable": true
        },
        {
          "name": "opponent",
          "writable": true
        },
        {
          "name": "challenge",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  97,
                  108,
                  108,
                  101,
                  110,
                  103,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "challengeId"
              }
            ]
          }
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "opponentTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "opponent"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "creatorTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "opponent"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "programTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "challenge"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "epoch",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "epochConfig"
              },
              {
                "kind": "const",
                "value": [
                  101,
                  112,
                  111,
                  99,
                  104
                ]
              },
              {
                "kind": "arg",
                "path": "args.signed_claim.claim_data.epoch_index"
              }
            ]
          }
        },
        {
          "name": "epochConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "const",
                "value": [
                  101,
                  112,
                  111,
                  99,
                  104,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "epoch_config.create_key",
                "account": "epochConfig"
              }
            ]
          },
          "relations": [
            "epoch"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "challengeId",
          "type": "string"
        },
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "verifyProofArgs"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "challenge",
      "discriminator": [
        119,
        250,
        161,
        121,
        119,
        81,
        22,
        208
      ]
    },
    {
      "name": "epoch",
      "discriminator": [
        93,
        83,
        120,
        89,
        151,
        138,
        152,
        108
      ]
    },
    {
      "name": "epochConfig",
      "discriminator": [
        190,
        66,
        87,
        197,
        214,
        153,
        144,
        193
      ]
    },
    {
      "name": "group",
      "discriminator": [
        209,
        249,
        208,
        63,
        182,
        89,
        186,
        254
      ]
    }
  ],
  "events": [
    {
      "name": "addEpochEvent",
      "discriminator": [
        44,
        4,
        13,
        72,
        233,
        106,
        126,
        98
      ]
    },
    {
      "name": "createDappEvent",
      "discriminator": [
        141,
        240,
        207,
        199,
        10,
        97,
        196,
        103
      ]
    },
    {
      "name": "createGroupEvent",
      "discriminator": [
        20,
        202,
        243,
        230,
        108,
        233,
        164,
        241
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidEpochDuration",
      "msg": "Invalid Epoch Duration"
    },
    {
      "code": 6001,
      "name": "invalidEpochIndex",
      "msg": "Invalid Epoch Index"
    },
    {
      "code": 6002,
      "name": "invalidWitness",
      "msg": "Invalid Witness"
    },
    {
      "code": 6003,
      "name": "unauthorized",
      "msg": "Unauthorized address"
    },
    {
      "code": 6004,
      "name": "hostTooLong",
      "msg": "Host length exceeds limit"
    },
    {
      "code": 6005,
      "name": "providerTooLong",
      "msg": "Provider length exceeds limit"
    },
    {
      "code": 6006,
      "name": "invalidWitnessClaimCount",
      "msg": "Invalid Witnes Claim count"
    },
    {
      "code": 6007,
      "name": "epochAlreadyExists",
      "msg": "Epoch already exists"
    },
    {
      "code": 6008,
      "name": "maxEpochLengthReached",
      "msg": "Max Epochs reached"
    },
    {
      "code": 6009,
      "name": "maxWitnessesReached",
      "msg": "Max Witnesses reached"
    },
    {
      "code": 6010,
      "name": "memberAlreadyExists",
      "msg": "Member already exists"
    },
    {
      "code": 6011,
      "name": "maxMembersReached",
      "msg": "Max Members reached"
    },
    {
      "code": 6012,
      "name": "invalidIdentifier",
      "msg": "Invalid Identifier"
    },
    {
      "code": 6013,
      "name": "invalidWitnessSignature",
      "msg": "Invalid Witness Signature"
    },
    {
      "code": 6014,
      "name": "arithmeticPanic",
      "msg": "Arithmetic Error"
    }
  ],
  "types": [
    {
      "name": "addEpochArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "witnesses",
            "type": {
              "vec": {
                "defined": {
                  "name": "witness"
                }
              }
            }
          },
          {
            "name": "minimumWitnessesForClaim",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "addEpochEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "epochConfig",
            "type": "pubkey"
          },
          {
            "name": "index",
            "type": "u32"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "expiredAt",
            "type": "i64"
          },
          {
            "name": "minimumWitnessesForClaim",
            "type": "u8"
          },
          {
            "name": "witnesses",
            "type": {
              "vec": {
                "defined": {
                  "name": "witness"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "challenge",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "opponent",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "wagerAmount",
            "type": "u64"
          },
          {
            "name": "resultSettled",
            "type": "bool"
          },
          {
            "name": "winner",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "challengeBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "changeEpochIndexEpochConfigArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newEpochIndex",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "claimData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "identifier",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "owner",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "u32"
          },
          {
            "name": "epochIndex",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "claimInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "provider",
            "type": "string"
          },
          {
            "name": "parameters",
            "type": "string"
          },
          {
            "name": "contextAddress",
            "type": "pubkey"
          },
          {
            "name": "contextMessage",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "createDappEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "createGroupArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "provider",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "createGroupEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "groupAddress",
            "type": "pubkey"
          },
          {
            "name": "provider",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "epoch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "epochConfig",
            "type": "pubkey"
          },
          {
            "name": "index",
            "type": "u32"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "expiredAt",
            "type": "i64"
          },
          {
            "name": "minimumWitnessesForClaim",
            "type": "u8"
          },
          {
            "name": "witnesses",
            "type": {
              "vec": {
                "defined": {
                  "name": "witness"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "epochConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "createKey",
            "type": "pubkey"
          },
          {
            "name": "deployer",
            "type": "pubkey"
          },
          {
            "name": "epochDurationSeconds",
            "type": "u64"
          },
          {
            "name": "epochIndex",
            "type": "u32"
          },
          {
            "name": "epochs",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "group",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "provider",
            "type": "string"
          },
          {
            "name": "members",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "initializeEpochConfigArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "epochDurationSeconds",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "signedClaim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "claimData",
            "type": {
              "defined": {
                "name": "claimData"
              }
            }
          },
          {
            "name": "signatures",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  65
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "verifyProofArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "claimInfo",
            "type": {
              "defined": {
                "name": "claimInfo"
              }
            }
          },
          {
            "name": "signedClaim",
            "type": {
              "defined": {
                "name": "signedClaim"
              }
            }
          }
        ]
      }
    },
    {
      "name": "witness",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          }
        ]
      }
    }
  ]
};
