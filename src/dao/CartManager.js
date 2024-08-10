import fs from "fs";

class CartManager {
  constructor(cartData) {
    this.path = cartData;
  }

  async getCart() {
    if (fs.existsSync(this.path)) {
      return JSON.parse(
        await fs.promises.readFile(this.path, { encoding: "utf-8" })
      );
    } else {
      return [];
    }
  }

  async addCart(name) {
    // validaciones quedan para ustedes...
    let heroes = await this.getHeroes();

    let id = 1;
    if (heroes.length > 0) {
      id = Math.max(...heroes.map((d) => d.id)) + 1;
    }

    heroes.push({
      id,
      name,
    });

    await fs.promises.writeFile(this.path, JSON.stringify(heroes, null, 5));
    console.log(`Heroe ${name} generado con id ${id}`);
  }
}

const heroesManager = new HeroesManager("./archivos/heroes.json");
// heroesManager.getHeroes().then(heroes=>console.log(heroes))

const app = async () => {
  console.log(await heroesManager.getHeroes());
  await heroesManager.addHeroe("Robin");
  console.log(await heroesManager.getHeroes());
};

app();
