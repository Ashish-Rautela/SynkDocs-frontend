import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTeamsStart,
  fetchTeamDetailsStart,
  createTeamStart,
  addMemberStart,
  updateMemberRoleStart,
  removeMemberStart,
  deleteTeamStart,
  clearCurrentTeam,
} from '../redux/slices/teamSlice';

export const useTeam = () => {
  const dispatch = useDispatch();
  const teamState = useSelector((state) => state.team || {});
  const authUser = useSelector((state) => state.auth?.user);
  const currentUserId = authUser?.userId || authUser?.id;

  const fetchTeams = () => dispatch(fetchTeamsStart());
  const fetchTeamDetails = (teamId) => dispatch(fetchTeamDetailsStart(teamId));
  const createTeam = (payload) => dispatch(createTeamStart(payload));
  const addMember = (payload) => dispatch(addMemberStart(payload));
  const updateMemberRole = (payload) => dispatch(updateMemberRoleStart(payload));
  const removeMember = (payload) => dispatch(removeMemberStart(payload));
  const deleteTeam = (teamId) => dispatch(deleteTeamStart(teamId));
  const clearTeam = () => dispatch(clearCurrentTeam());

  return {
    teams: teamState.teams || [],
    currentTeam: teamState.currentTeam,
    loading: teamState.loading,
    error: teamState.error,
    currentUserId,
    fetchTeams,
    fetchTeamDetails,
    createTeam,
    addMember,
    updateMemberRole,
    removeMember,
    deleteTeam,
    clearTeam,
  };
};
