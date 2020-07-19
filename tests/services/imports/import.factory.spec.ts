import importFactory from '../../../src/services/imports/import.factory';
import import750gService from '../../../src/services/imports/import-750g.service';
import importMarmitonService from '../../../src/services/imports/import-marmiton.service';
import importCuisineAZService from '../../../src/services/imports/import-cuisine-az.service';

describe('ImportFactory', () => {
  const urlTest = [
    {
      url: 'https://www.750g.com/comment-faire-une-salade-legere-au-pamplemousse-crevettes-et-vermicelles-de-riz-en-10-etapes-r200155.htm',
      service: import750gService,
    }, {
      url: 'https://www.marmiton.org/recettes/recette_souffles-de-carottes-au-gouda-au-cumin_70699.aspx',
      service: importMarmitonService,
    }, {
      url: 'https://www.cuisineaz.com/recettes/cannelloni-au-chevre-et-aux-epinards-65332.aspx',
      service: importCuisineAZService,
    },
  ];
  urlTest.forEach((testEntry) => {
    it('should return import750gService', () => {
      // given
      const { url } = testEntry;

      // when
      const importService = importFactory.getService(url);

      // then
      expect(importService).toBe(testEntry.service);
    });
  });
  it('should throw an error when url unknown', () => {
    // given
    const url = 'https://www.facebook.com/';

    // then
    expect(() => {
      // when
      importFactory.getService(url);
    }).toThrow('Import service not found!');
  });
});
