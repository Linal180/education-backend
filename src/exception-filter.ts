import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, _host: ArgumentsHost) {
    const status = exception.getStatus();
    const response = exception.getResponse();
    const parsedResponse = this.responseParser(response);
    return {
      response: {
        status: parsedResponse['status'] ? parsedResponse['status'] : status,
        error: parsedResponse['error']
          ? parsedResponse['error']
          : response['error'],
        message: parsedResponse['message']
          ? parsedResponse['message']
          : exception.message,
        name: exception.name,
      },
    };
  }

  responseParser(exception: string | object): object {
    const response = JSON.parse(JSON.stringify(exception));
    console.log(
      '<<<<<<<<<<<<<<<<< RESPONSE EXCEPTION >>>>>>>>>>>>>>>>>>>',
      response,
    );
    return {
      status: response.response?.status,
      error: response.response?.error,
      message: response.response?.message,
    };
  }
}
