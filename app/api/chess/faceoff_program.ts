/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/faceoff_program.json`.
 */
export type FaceoffProgram = {
  "address": "J7NDrWGG2Y77xq21VphX1ue4xeEX4LViLAPheNhni8cb",
  "metadata": {
    "name": "faceoffProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
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
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "programAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  103,
                  101,
                  114,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
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
          "name": "opponent",
          "writable": true,
          "signer": true
        },
        {
          "name": "programAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  103,
                  101,
                  114,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
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
          "name": "opponent",
          "writable": true
        },
        {
          "name": "creator",
          "writable": true
        },
        {
          "name": "programAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  103,
                  101,
                  114,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
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
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "winner",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "challengeId",
          "type": "string"
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "challengeAlreadyJoined",
      "msg": "The challenge has already been joined."
    },
    {
      "code": 6001,
      "name": "cannotJoinYourOwnChallenge",
      "msg": "You cannot join your own challenge."
    },
    {
      "code": 6002,
      "name": "wagerAlreadySettled",
      "msg": "The wager has already been settled."
    },
    {
      "code": 6003,
      "name": "incorrectWagerAmount",
      "msg": "The wager amount is incorrect."
    },
    {
      "code": 6004,
      "name": "thirdPersonWinner",
      "msg": "Winner is neither creator nor opponent."
    },
    {
      "code": 6005,
      "name": "missingAccounts",
      "msg": "Missing accounts in remaining_accounts"
    },
    {
      "code": 6006,
      "name": "wrongOpponent",
      "msg": "Not the same opponent being passed, while settling"
    },
    {
      "code": 6007,
      "name": "wrongCreator",
      "msg": "Not the same creator being passed, while settling"
    }
  ],
  "types": [
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
          },
          {
            "name": "programAccountBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "seed",
      "type": "string",
      "value": "\"anchor\""
    }
  ]
};
