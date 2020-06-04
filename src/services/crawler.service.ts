import axios from 'axios';
import cheerio from 'cheerio';

class CrawlerService {
  static getPage(url: string): Promise<CheerioStatic> {
    return axios.get(url).then((response) => cheerio.load(response.data));
  }

  static getImage(url: string): Promise<string> {
    return axios.get(url, { responseType: 'arraybuffer' }).then((response) => Buffer.from(response.data, 'binary').toString('base64'));
  }
}

export default CrawlerService;
