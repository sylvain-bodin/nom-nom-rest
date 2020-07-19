import import750gService from './import-750g.service';
import { ImportService } from './import.service';
import importMarmitonService from './import-marmiton.service';
import importCuisineAZService from './import-cuisine-az.service';

interface ServiceMap {
  url : string,
  service : ImportService
}


class ImportFactory {
  constructor(private serviceMapping : ServiceMap[]) {
  }

  getService(url: string): ImportService {
    const result = this.serviceMapping.filter((value) => url.includes(value.url));
    if (result.length > 0) {
      return result[0].service;
    }
    throw new Error('Import service not found!');
  }
}

const serviceMapping : ServiceMap[] = [
  {
    url: 'www.750g.com',
    service: import750gService,
  },
  {
    url: 'www.marmiton.org',
    service: importMarmitonService,
  }, {
    url: 'www.cuisineaz.com',
    service: importCuisineAZService,
  },
];

const importFactory = new ImportFactory(serviceMapping);
export default importFactory;
