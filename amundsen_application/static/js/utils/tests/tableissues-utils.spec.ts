import { truncateText } from '../tableissues-utils'; 

describe('tableissue-utils ', () => {
  describe('truncateText', () => {
    it('returns null if null passed in', () => {
      expect(null).toEqual(truncateText(null)); 
    });
    
    it('returns text with added blurb if it is not very long', () => {
      expect("\"test text\" is associated with this table").toEqual(truncateText('test text')); 
    }); 

    it('returns truncated text added blurb if it is not very long', () => {
      expect("\"\"this is a very long example of ...\" is associated with this table").toEqual(
        truncateText("\"this is a very long example of a ji\" is associated with this table")); 
    }); 
  }); 
}); 
