import { AccountUpdate, Field, Mina, PrivateKey, PublicKey, Signature } from 'o1js';
import { TokenDrop } from './TokenDrop';
import { stringToBigInt } from '../utils/stringUtils';


let proofsEnabled = false;

describe('TokenDrop', () => {
  let senderAccount: Mina.TestPublicKey,
    senderKey: PrivateKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: TokenDrop;

  beforeAll(async () => {
    if (proofsEnabled) await TokenDrop.compile();
  });

  beforeEach(async () => {
    const Local = await Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    const deployerAccount = Local.testAccounts[0];
    senderAccount = Local.testAccounts[1];
    senderKey = senderAccount.key;

    zkAppPrivateKey = PrivateKey.random();
    zkApp = new TokenDrop(zkAppPrivateKey.toPublicKey());

    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await zkApp.deploy();
    });
    await txn.prove();
    await txn.sign([deployerAccount.key, zkAppPrivateKey]).send();
  });

  it('Initialized `TokenDrop` with the correct key', async () => {
    const oracleKey = zkApp.oracleKey.get();
    expect(oracleKey).toEqual(PublicKey.fromBase58('B62qphyUJg3TjMKi74T2rF8Yer5rQjBr1UyEG7Wg9XEYAHjaSiSqFv1'));
  });
  describe('TokenDrop with hardcoded values', () => {
    it('`TokenDrop` verifies the api response', async () => {
      const contributions = 67;
      const username = "katien";
      const fieldEncodedUsername = Field(stringToBigInt(username));
      const signature = Signature.fromBase58('7mXBiworTwfx5fYu5nFrgQGxZworLmh8oictQGXw8SDR1z3CEJJbiBitfFrADazUj7AYr5GMTT2b8Vdq6gpwCTNJ2uhB4MUx');
      const txn = await Mina.transaction(senderAccount, async () => {
        await zkApp.verifyContribution(Field(stringToBigInt(username)),Field(contributions), signature);
      });

      await txn.prove();
      await txn.sign([senderKey]).send();

      // check that the verification event was emitted
      const events = await zkApp.fetchEvents();
      const verifiedEventValue = events[0].event.data.toFields(null)[0];
      expect(verifiedEventValue.toString()).toEqual(fieldEncodedUsername.toString());
    });
  });
});
