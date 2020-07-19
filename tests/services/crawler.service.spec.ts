import fs from 'fs';
import crawlerService from '../../src/services/crawler.service';


describe('Crawler Service', () => {
  it('should get the html', async () => {
    // given

    // when
    const $ = await crawlerService.getPage('https://www.750g.com/riz-saute-au-poulet-legumes-et-amandes-r205183.htm');

    // then
    expect($.html()).not.toBeNull();
    expect($.html()).toBeDefined();
    expect($('html')[0].name).toBe('html');
  });

  it('should get the image data', async () => {
    // given
    const image = fs.readFileSync('./tests/resources/photo_riz_poulet.jpg');
    const imageBase64 = image.toString('base64');

    // when
    const expectedData = await crawlerService.getImage('https://static.750g.com/images/640-420/59d5fcc850fd3b95d363b1ff64912202/riz-saute-au-poulet-et-aux-legumes.jpg');
    fs.writeFileSync('./tests/image_retour.jpg', expectedData);
    // then
    expect(expectedData).toBe(imageBase64);
  });
});
