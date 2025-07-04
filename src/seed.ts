import { NestFactory } from "@nestjs/core";
import { SeedsService } from "./seeds/seeds.service";
import { SeedsModule } from "./seeds/seeds.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
    const logger = new Logger("Seed");
    const app = await NestFactory.createApplicationContext(SeedsModule);

    const seedsService = app.get(SeedsService);
    await seedsService.seed();

    logger.log("Database seeded successfully");

    await app.close();
}
bootstrap();
