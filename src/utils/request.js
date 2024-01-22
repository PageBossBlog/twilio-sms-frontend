import axios from "axios";

const API_BASE_URL = "http://localhost:8800/sms-sender";

//THIS SMS Sender WAS BUILT BY "PAGEBOSS [https://t.me/pageboss] OWNER OF SCAMPAGESHOP [www.scampage.shop]" and has AES 256-bit encryption. Any adjustments to the code would break it//
        
        //Do not touch this section
        
        //If you want to get quality:
          // - USA Banks Scampage
          // - UK Banks Scampage
          // - Australian Scampage
          // - Canadian Scampage
          // - Crypto Websites Scampage 
          // - Email Accounts Scampage
          // - Newsletter Scampage and more..
        
        // Visit: https://www.scampage.shop/

const request = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const makeRequest = async ({ method, url, data }) => {
  const response = await request({ method, url, data });
  return response.data;
};

export default request;
