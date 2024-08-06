import { ClientRequest } from "http";
import http = require("https");

/**
 * https request class in typesript to show how to manage errors and events
 * to help prevent ECONNRESET errors
 */
export class HttpRequest {

    public async send(options: http.RequestOptions, data?: any): Promise<any> {

        let result: string = "";
        const promise = new Promise((resolve, reject) => {


            const req: ClientRequest = http.request(options, (res) => {

                console.log('statusCode:', res.statusCode);
                console.log('headers:', res.headers);

                res.on("data", chunk => {
                    result += chunk;
                });

                res.on("error", err => {
                    console.log(err);
                    reject(err);
                });

                res.on("end", () => {
                    try {
                        let body = result;
                        //there are empty responses

                        if (res.statusCode === 200) {
                            body = JSON.parse(result);
                        }

                        console.log(res.statusCode, result);

                        resolve(body);
                    } catch (err) {
                        console.log(err);
                        reject(err);
                    }
                });
            });

            /***
             * handles the errors on the request
             */
            req.on("error", (err) => {
                console.log(err);
                reject(err);
            });

            /***
             * handles the timeout error
             */
            req.on('timeout', (err) => {
                console.log(err);
                req.abort();
            });

            /***
             * unhandle errors on the request
             */
            req.on('uncaughtException', (err) => {
                console.log(err);
                req.abort();
            });

            /**
             * adds the payload/body
             */
            if (data) {
                const body = JSON.stringify(data);
                req.write(body);
            }

            /**
             * end the request to prevent ECONNRESETand socket hung errors
             */
            req.end(() => {
                console.log('request ends');
            });

        });

        return promise;
    }
}


/**
 * entry point function to make a http request
 */
const main = async () => {

    /**
     * define the http request options
     */
    const requestOptions: http.RequestOptions = {

        hostname: "hostname.com",
        method: "GET",
        path: "/api/data",
        port: 443,
        headers: {
            Accept: "application/json;odata=verbose",
            Authorization: "auth-token",
            "Content-Type": "application/json;odata=verbose",
        },
        timeout: 5 * (1000)  //n seconds
        //TLS options below
        //secureProtocol: 'TLSv1_method', 
    };

    const request = new HttpRequest();
    const resp = await request.send(requestOptions);
    console.log(resp);
}

//run the main function
main();