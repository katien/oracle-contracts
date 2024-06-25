import { SmartContract, state, State, method, PublicKey, Signature, Field } from 'o1js';

export class TokenDrop extends SmartContract {
  @state(PublicKey) oracleKey = State<PublicKey>();
  @state(Field) minContributions = State<Field>();

  events = {
    contributed: Field
  };

  init() {
    super.init();
    // todo: read from env
    this.oracleKey.set(PublicKey.fromBase58("B62qphyUJg3TjMKi74T2rF8Yer5rQjBr1UyEG7Wg9XEYAHjaSiSqFv1"));
    this.minContributions.set(Field(66));
  }

  @method
  // todo: id should be a circuitstring with username
  async verifyContribution(id: Field, contributions: Field, signature: Signature) {
    const oracleKey = this.oracleKey.getAndRequireEquals();
    const result = signature.verify(oracleKey, [id, contributions]);
    result.assertTrue("The signature was invalid");
    const minContributions = this.minContributions.getAndRequireEquals();
    contributions.assertGreaterThanOrEqual(minContributions, 'Contributions too low');
    this.emitEvent("contributed", id);
  }


}

