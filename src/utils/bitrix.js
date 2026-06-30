export const BITRIX_BASE = 'https://regaliscapitalcorp.bitrix24.com/rest/1/nk4lkwq9527dxv4n';
export const TEAM_FIELD = 'UF_USR_1779466932710';
export const TEAM_LEAD_FIELD = 'UF_CRM_1782826965894';
export const CLIENT_STATUS_FIELD = 'UF_CRM_1755185977882';
export const DEAL_FLOW_START_DATE_FIELD = 'UF_CRM_1755184781147';
export const ONBOARDING_CALL_DATE_FIELD = 'UF_CRM_1755183436825';
export const DATE_OFFBOARDED_FIELD = 'UF_CRM_1768858493789';
export const DATE_PAUSED_FIELD = 'UF_CRM_1769099686480';

export const CLIENT_STATUS_LOOKUP = {
  '65': 'Setting Up',
  '67': 'Deal Flow',
  '69': 'Post LOI',
  '71': 'Closing Stage',
  '73': 'Deal Closed',
  '75': 'Closed Lost',
  '77': 'Rescinded',
  '79': 'Terminated',
  '81': 'Paused',
};

export async function fetchAllBitrixUsers() {
  const users = [];
  let start = 0;
  const batchSize = 50;
  let hasMore = true;

  while (hasMore) {
    const url = `${BITRIX_BASE}/user.get.json?start=${start}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.result && data.result.length > 0) {
      users.push(...data.result);
      start += batchSize;
    } else {
      hasMore = false;
    }
  }

  return users;
}

export function normalizeBitrixUsers(rawUsers) {
  return rawUsers.map(user => ({
    id: user.ID,
    email: user.EMAIL,
    fullName: `${user.NAME} ${user.LAST_NAME}`.trim(),
    firstName: user.NAME,
    lastName: user.LAST_NAME,
    teamName: user[TEAM_FIELD] || 'Unassigned',
    position: user.WORK_POSITION,
    active: user.ACTIVE === 'Y',
    departments: user.UF_DEPARTMENT || [],
  }));
}

export function buildEmailToUserMap(normalizedUsers) {
  const map = {};
  normalizedUsers.forEach(user => {
    if (user.email) {
      map[user.email] = user;
    }
  });
  return map;
}

export async function fetchAllBitrixContacts() {
  const contacts = [];
  let start = 0;
  const batchSize = 50;
  let hasMore = true;

  while (hasMore) {
    const url = `${BITRIX_BASE}/crm.contact.list.json?start=${start}&select[]=*&select[]=${CLIENT_STATUS_FIELD}&select[]=${DEAL_FLOW_START_DATE_FIELD}&select[]=${ONBOARDING_CALL_DATE_FIELD}&select[]=${DATE_OFFBOARDED_FIELD}&select[]=${DATE_PAUSED_FIELD}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error || data.error_description || 'Failed to fetch contacts');
    }
    
    if (data.result && data.result.length > 0) {
      contacts.push(...data.result);
      
      // Use the 'next' field from the response for pagination
      if (data.next) {
        start = data.next;
      } else {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }

  return contacts;
}

export function normalizeBitrixContacts(rawContacts) {
  return rawContacts.map(contact => {
    const clientStatusId = contact[CLIENT_STATUS_FIELD];
    const clientStatus = CLIENT_STATUS_LOOKUP[String(clientStatusId)] || 'Unassigned';
    return {
      id: contact.ID,
      fullName: `${contact.NAME || ''} ${contact.LAST_NAME || ''}`.trim(),
      clientStatus,
      assignedById: contact.ASSIGNED_BY_ID || null,
      dealFlowStartDate: contact[DEAL_FLOW_START_DATE_FIELD] || null,
      onboardingCallDate: contact[ONBOARDING_CALL_DATE_FIELD] || null,
      dateOffboarded: contact[DATE_OFFBOARDED_FIELD] || null,
      datePaused: contact[DATE_PAUSED_FIELD] || null,
    };
  });
}
