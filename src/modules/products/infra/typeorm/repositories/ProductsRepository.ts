import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    return this.ormRepository.create({
      name,
      price,
      quantity,
    });
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsOnDatabase = (products.map(async ({ id }) => {
      return this.ormRepository.findOne({
        where: {
          id,
        },
      });
    }) as unknown) as Product[];

    return productsOnDatabase || [];
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsUpdated = (products.map(async ({ id, quantity }) => {
      return this.ormRepository.update(
        {
          id,
        },
        {
          quantity,
        },
      );
    }) as unknown) as Product[];

    return productsUpdated || [];
  }
}

export default ProductsRepository;
