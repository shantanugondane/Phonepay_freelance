const axios = require('axios');

/**
 * Salesforce API Service
 * Handles authentication and API calls to Salesforce
 */

class SalesforceService {
  constructor() {
    this.instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
    this.username = process.env.SALESFORCE_USERNAME;
    this.password = process.env.SALESFORCE_PASSWORD;
    this.securityToken = process.env.SALESFORCE_SECURITY_TOKEN;
    this.clientId = process.env.SALESFORCE_CLIENT_ID;
    this.clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    this.apiVersion = process.env.SALESFORCE_API_VERSION || 'v62.0';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Authenticate with Salesforce using Username/Password flow
   * This is the simplest method - you may need OAuth 2.0 if this doesn't work
   */
  async authenticate() {
    try {
      // Check if we have a valid token
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      // If using OAuth 2.0 (Username/Password flow)
      if (this.clientId && this.clientSecret) {
        const authUrl = `${this.instanceUrl}/services/oauth2/token`;
        
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('client_id', this.clientId);
        params.append('client_secret', this.clientSecret);
        params.append('username', this.username);
        params.append('password', this.password + (this.securityToken || ''));

        const response = await axios.post(authUrl, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        this.accessToken = response.data.access_token;
        this.instanceUrl = response.data.instance_url || this.instanceUrl;
        
        // Set token expiry (usually expires in 2 hours, set to 1.5 hours for safety)
        this.tokenExpiry = Date.now() + (90 * 60 * 1000);
        
        return this.accessToken;
      } else {
        // If credentials are not set, throw error
        throw new Error('Salesforce credentials not configured. Please set SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, SALESFORCE_USERNAME, SALESFORCE_PASSWORD in .env file');
      }
    } catch (error) {
      console.error('Salesforce authentication error:', error.response?.data || error.message);
      throw new Error(`Failed to authenticate with Salesforce: ${error.response?.data?.error_description || error.message}`);
    }
  }

  /**
   * Fetch cases from Salesforce using the provided query endpoint
   */
  async getCases(filters = {}) {
    try {
      // Authenticate first
      await this.authenticate();

      // Build the query
      // Base query from Vinoth's email
      let query = 'SELECT Id,CaseNumber,Subject,Status,Substatus__c,Buyer_Name__c,Requestor_Name__c,Grand_Total_Final_Order__c,Start_Date_Time__c,End_Date_Time__c,Ticket_Type__c,Spotdraft_ID__c,Vendor_Name__c,Start_Date__c,Execution_Date__c,Stamp_Paper_Date__c,days_to_expiry__c,expiry_status__c,Contract_Status__c,TPI_Applicability__c,AC_Applicability__c,DD_Status__c FROM Case';

      // Add filters if provided
      const whereClauses = [];
      if (filters.status) {
        whereClauses.push(`Status = '${filters.status}'`);
      }
      if (filters.caseNumber) {
        whereClauses.push(`CaseNumber = '${filters.caseNumber}'`);
      }
      if (filters.requestorName) {
        whereClauses.push(`Requestor_Name__c = '${filters.requestorName}'`);
      }
      if (filters.vendorName) {
        whereClauses.push(`Vendor_Name__c = '${filters.vendorName}'`);
      }

      if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
      }

      // Add ORDER BY
      query += ' ORDER BY CreatedDate DESC';

      // Encode the query
      const encodedQuery = encodeURIComponent(query);

      // Make the API call
      const url = `${this.instanceUrl}/services/data/${this.apiVersion}/query/?q=${encodedQuery}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Transform Salesforce data to match our app's format
      const cases = response.data.records.map(this.transformCase);

      return {
        cases,
        totalSize: response.data.totalSize,
        done: response.data.done,
      };
    } catch (error) {
      console.error('Salesforce API error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch cases from Salesforce: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Transform Salesforce Case to match our PSR format
   */
  transformCase(sfCase) {
    return {
      // Salesforce fields
      salesforceId: sfCase.Id,
      caseNumber: sfCase.CaseNumber,
      subject: sfCase.Subject,
      status: sfCase.Status,
      substatus: sfCase.Substatus__c,
      buyerName: sfCase.Buyer_Name__c,
      requestorName: sfCase.Requestor_Name__c,
      grandTotal: sfCase.Grand_Total_Final_Order__c,
      startDateTime: sfCase.Start_Date_Time__c,
      endDateTime: sfCase.End_Date_Time__c,
      ticketType: sfCase.Ticket_Type__c,
      spotdraftId: sfCase.Spotdraft_ID__c,
      vendorName: sfCase.Vendor_Name__c,
      contractStartDate: sfCase.Start_Date__c,
      executionDate: sfCase.Execution_Date__c,
      stampPaperDate: sfCase.Stamp_Paper_Date__c,
      daysToExpiry: sfCase.days_to_expiry__c,
      expiryStatus: sfCase.expiry_status__c,
      contractStatus: sfCase.Contract_Status__c,
      tpiApplicability: sfCase.TPI_Applicability__c,
      acApplicability: sfCase.AC_Applicability__c,
      ddStatus: sfCase.DD_Status__c,
      
      // Mapped fields for compatibility with existing UI
      psrId: sfCase.CaseNumber,
      title: sfCase.Subject,
      department: sfCase.Ticket_Type__c || 'N/A',
      budget: {
        amount: sfCase.Grand_Total_Final_Order__c || 0,
        currency: 'INR',
        display: sfCase.Grand_Total_Final_Order__c 
          ? `INR ${(sfCase.Grand_Total_Final_Order__c / 1000000).toFixed(1)}M` 
          : 'INR 0'
      },
      // Mark as Salesforce data
      source: 'salesforce',
      createdAt: sfCase.Start_Date_Time__c || new Date().toISOString(),
    };
  }

  /**
   * Get a single case by Case Number
   */
  async getCaseByNumber(caseNumber) {
    try {
      const result = await this.getCases({ caseNumber });
      return result.cases.length > 0 ? result.cases[0] : null;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new SalesforceService();
