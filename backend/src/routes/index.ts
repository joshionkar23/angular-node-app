import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { cartRouter } from "./cart.routes.js";
import { healthRouter } from "./health.routes.js";
import { productRouter } from "./product.routes.js";
import { categoryRouter } from "./category.routes.js";
import { userRouter } from "./user.routes.js";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(authRouter);
apiRouter.use(userRouter);
apiRouter.use(productRouter);
apiRouter.use(categoryRouter);
apiRouter.use(cartRouter);
