import { useState, useEffect } from 'react';
import { fetchAllBitrixUsers, normalizeBitrixUsers, buildEmailToUserMap } from '../utils/bitrix';

let _cachedUsers = null;
let _cachedMap = null;

export function useBitrixUsers() {
  const [users, setUsers] = useState(_cachedUsers || []);
  const [userMap, setUserMap] = useState(_cachedMap || {});
  const [loading, setLoading] = useState(!_cachedUsers);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (_cachedUsers && _cachedMap) {
      setUsers(_cachedUsers);
      setUserMap(_cachedMap);
      setLoading(false);
      return;
    }

    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const rawUsers = await fetchAllBitrixUsers();
        const normalized = normalizeBitrixUsers(rawUsers);
        const map = buildEmailToUserMap(normalized);
        
        _cachedUsers = normalized;
        _cachedMap = map;
        
        setUsers(normalized);
        setUserMap(map);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  function getUser(email) {
    return userMap[email] || null;
  }

  function enrichRow(row) {
    const user = getUser(row.email);
    if (user) {
      return {
        ...row,
        sourcer_name: user.fullName,
        team_name: user.teamName,
        work_position: user.position,
      };
    }
    return row;
  }

  return { users, userMap, loading, error, getUser, enrichRow };
}
