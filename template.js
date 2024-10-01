import http from "k6/http";
import { sleep, check } from "k6";
import { open } from "k6/fs";

export let options = {
  stages: [
    { duration: "1m", target: 10 },
    { duration: "1m", target: 10 },
    { duration: "1m", target: 20 },
    { duration: "1m", target: 20 },
    { duration: "1m", target: 0 },
  ],
};

export default function () {
  let token = "your_bearer_token_here";

  let file1 = open("path_to_your_file", "b");
  let base64File1 = btoa(file1);

  let file2 = open("path_to_your_file", "b");
  let base64File2 = btoa(file2);

  let payload = JSON.stringify({
    username: "uname123",
    password: "upass123",
    lastName: "Dela Cruz",
    firstName: "Juan",
    middleName: "Mabini",
    fileName1: base64File1,
    // fileName1: http.file(file1, "filename1.ext"),
    fileName2: base64File2,
    // fileName2: http.file(file2, "filename2.ext"),
  });

  let params = {
    headers: {
      "Content-Type": "application/json", // remove if file is not base64
      Authorization: `Bearer ${token}`,
    },
  };

  let res = http.post("https://test-api.example.com/post", payload, params);
  // let res = http.get("https://test-api.example.com/get", payload, params);
  // let res = http.put('https://test-api.example.com/put', payload, params);
  // let res = http.del('https://test-api.example.com/delete', payload, params);

  check(res, {
    "status ok": (r) => r.status === 200,
    "access denied": (r) => r.status === 403,
    "resource not found": (r) => r.status === 404,
    "internal server error": (r) => r.status === 500,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });

  sleep(1);
}
