import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  it('returns enabled categories from the service', () => {
    const service = new CategoriesService();
    const controller = new CategoriesController(service);

    expect(controller.listCategories()).toBe(service.listEnabled());
  });
});
