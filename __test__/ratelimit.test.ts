import { fixedWindow } from "../src/controllers/ratelimit.controller";
import { mockRequest, mockResponse } from "../__mocks__/request.mock";

describe("fixed window", () => {
    it("should access the fixed window algo", () => {
        // @ts-expect-error @ts-ignore
        fixedWindow(mockRequest, mockResponse).then((data) =>
            console.log(data),
        );
        expect(mockResponse.json).toHaveBeenCalled();
    });
});
