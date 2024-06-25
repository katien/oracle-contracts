import { SmartContract, state, State, method, PublicKey, Signature, Field } from 'o1js';

export class TokenDrop extends SmartContract {
  @state(PublicKey) oracleKey = State<PublicKey>();
  @state(Field) minStars = State<Field>();

  events = {
    contributionVerified: Field
  };

  init() {
    super.init();
    // todo: read from env
    this.oracleKey.set(PublicKey.fromBase58("B62qphyUJg3TjMKi74T2rF8Yer5rQjBr1UyEG7Wg9XEYAHjaSiSqFv1"));
    this.minStars.set(Field(1));
  }

  @method
  // todo: id should be a circuitstring with username
  async verifyContribution(id: Field, stars: Field, signature: Signature) {
    const oracleKey = this.oracleKey.getAndRequireEquals();
    const result = signature.verify(oracleKey, [id, stars]);
    result.assertTrue("The signature was invalid");
    const minContributions = this.minStars.getAndRequireEquals();
    stars.assertGreaterThanOrEqual(minContributions, 'Stars too low');
    this.emitEvent("contributionVerified", id);
  }


}

