import import750gService from './import-750g.service';
import { ImportService } from './import.service';

class ImportFactory {
  constructor(private importService: ImportService) {
  }

  getService(url: string): ImportService {
    if (url.includes('www.750g.com')) {
      return this.importService;
    }
    throw new Error('Import service not found!');
  }
}

const importFactory = new ImportFactory(import750gService);
export default importFactory;
