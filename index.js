import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5200;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log('route: /');
    res.send('Hello World!');
});
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});