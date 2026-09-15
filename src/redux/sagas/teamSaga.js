import { call, put, takeLatest, all } from 'redux-saga/effects';
import { teamApi } from '../../services/teamApi';
import { addToast } from '../slices/notificationSlice';
import {
  fetchTeamsStart,
  fetchTeamsSuccess,
  fetchTeamsFailure,
  fetchTeamDetailsStart,
  fetchTeamDetailsSuccess,
  fetchTeamDetailsFailure,
  createTeamStart,
  createTeamSuccess,
  createTeamFailure,
  addMemberStart,
  addMemberSuccess,
  addMemberFailure,
  updateMemberRoleStart,
  updateMemberRoleSuccess,
  updateMemberRoleFailure,
  removeMemberStart,
  removeMemberSuccess,
  removeMemberFailure,
  deleteTeamStart,
  deleteTeamSuccess,
  deleteTeamFailure,
} from '../slices/teamSlice';

function* handleFetchTeams() {
  try {
    const teams = yield call(teamApi.getTeams);
    yield put(fetchTeamsSuccess(teams));
  } catch (error) {
    yield put(fetchTeamsFailure(error.message));
  }
}

function* handleFetchTeamDetails(action) {
  try {
    const team = yield call(teamApi.getTeamById, action.payload);
    yield put(fetchTeamDetailsSuccess(team));
  } catch (error) {
    yield put(fetchTeamDetailsFailure(error.message));
    yield put(addToast({ type: 'error', message: 'Failed to load team details' }));
  }
}

function* handleCreateTeam(action) {
  try {
    const newTeam = yield call(teamApi.createTeam, action.payload);
    yield put(createTeamSuccess(newTeam));
    yield put(
      addToast({
        type: 'success',
        message: `Team "${newTeam.name || action.payload.name}" created successfully!`,
      })
    );
  } catch (error) {
    yield put(createTeamFailure(error.message));
    yield put(addToast({ type: 'error', message: error.message || 'Failed to create team' }));
  }
}

function* handleAddMember(action) {
  try {
    const member = yield call(teamApi.addMember, action.payload);
    yield put(addMemberSuccess(member));
    yield put(
      addToast({
        type: 'success',
        message: `Member ${action.payload.email} added to team!`,
      })
    );
  } catch (error) {
    yield put(addMemberFailure(error.message));
    yield put(addToast({ type: 'error', message: error.message || 'Failed to add member' }));
  }
}

function* handleUpdateMemberRole(action) {
  try {
    yield call(teamApi.updateMemberRole, action.payload);
    yield put(updateMemberRoleSuccess(action.payload));
    yield put(
      addToast({
        type: 'success',
        message: 'Member permissions updated successfully!',
      })
    );
  } catch (error) {
    yield put(updateMemberRoleFailure(error.message));
    yield put(addToast({ type: 'error', message: error.message || 'Failed to update member role' }));
  }
}

function* handleRemoveMember(action) {
  try {
    yield call(teamApi.removeMember, action.payload);
    yield put(removeMemberSuccess(action.payload));
    yield put(
      addToast({
        type: 'success',
        message: 'Member removed from team',
      })
    );
  } catch (error) {
    yield put(removeMemberFailure(error.message));
    yield put(addToast({ type: 'error', message: error.message || 'Failed to remove member' }));
  }
}

function* handleDeleteTeam(action) {
  try {
    yield call(teamApi.deleteTeam, action.payload);
    yield put(deleteTeamSuccess(action.payload));
    yield put(
      addToast({
        type: 'success',
        message: 'Team deleted successfully',
      })
    );
  } catch (error) {
    yield put(deleteTeamFailure(error.message));
    yield put(addToast({ type: 'error', message: error.message || 'Failed to delete team' }));
  }
}

export function* teamSaga() {
  yield all([
    takeLatest(fetchTeamsStart.type, handleFetchTeams),
    takeLatest(fetchTeamDetailsStart.type, handleFetchTeamDetails),
    takeLatest(createTeamStart.type, handleCreateTeam),
    takeLatest(addMemberStart.type, handleAddMember),
    takeLatest(updateMemberRoleStart.type, handleUpdateMemberRole),
    takeLatest(removeMemberStart.type, handleRemoveMember),
    takeLatest(deleteTeamStart.type, handleDeleteTeam),
  ]);
}
