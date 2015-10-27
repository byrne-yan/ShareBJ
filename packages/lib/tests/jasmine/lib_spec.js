describe('sbj:lib', () => {
  it("should have 'ShareBJ' variable", () => expect(ShareBJ).toBeDefined());

  describe('ShareBJ', () => {
    it("should have a 'VERSION'", () => expect(ShareBJ.VERSION).toBeDefined());

    //it("should have 'schemas'", () => expect(ShareBJ.schemas).toBeDefined());

    //it("should have a 'allowCheck' method", () => expect(ShareBJ.allowCheck).toBeDefined());
  });

/*
  describe("Meteor.Collection", ()=> {
    it("should have a 'addField' method", () => expect(Meteor.Collection.prototype.addField).toBeDefined());
    it("should have a 'removeField' method", ()=> expect(Meteor.Collection.prototype.removeField).toBeDefined());
    it("should have a 'removeField' method", () => expect(Meteor.Collection.prototype.allowCheck).toBeDefined());
  });

  describe("SimpleSchema", () => {
    it("should have a 'getEditableFields' method",() => expect(SimpleSchema.prototype.getEditableFields).toBeDefined());
    it("should have a 'getPublicFields' method", () => expect(SimpleSchema.prototype.getPublicFields).toBeDefined());
     it("should have a 'getProfileFields' method", () => expect(SimpleSchema.prototype.getProfileFields).toBeDefined());
  })
*/
});