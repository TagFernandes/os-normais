import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as sql from 'mssql';
import config from '../config';


export async function ReadProdutoFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        let pool = await sql.connect(config);
        context.log("Database Connected Successfully");

        let result = await pool.request()
            .query('SELECT Id, Nome FROM Produto');

        pool.close();

         return { status: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.recordset) };
    } catch (err) {
        context.log("Erro ao conectar ao banco de dados:", err);

        return {
            status: 500,
            body: 'Erro ao conectar ao banco de dados'
        };
    }
};

app.http('ReadProdutoFunction', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'produtos',
    handler: ReadProdutoFunction
});
