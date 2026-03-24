import { app, port } from "./app.js";
import DBConnection from "./src/utils/dbConnection.js";


DBConnection()
.then(() => {
    app.listen(port, () => {
        console.log(`App is running on http://localhost:${port}`);
    })
})