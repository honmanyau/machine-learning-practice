import { action, configure, observable } from 'mobx';

configure({ enforceActions: true });

interface IAccountInfoObject {
  activated: boolean;
  displayName: string;
  email: string;
  username: string;
}

interface IUpdatedAccountInfoObject {
  displayName?: string;
  email?: string;
  username?: string;
}

const host = process.env.REACT_APP_DEV_HOST || '';

/**
 * This class is used to create a MonX store for components associated with
 * views that deal with settings, which are components that are rendered with
 * paths that begins with {@code /settings}.
 */
class SettingsStore {
  @observable public fetching: boolean = true;
  @observable public activated: boolean | '' = '';
  @observable public displayName: string = '';
  @observable public email: string = '';
  @observable public username: string = '';

  @action public setFetching = (fetching: boolean): void => {
    this.fetching = fetching;
  }

  @action public setActivated = (activated: boolean): void => {
    this.activated = activated;
  }

  @action public setDisplayName = (displayName: string): void => {
    this.displayName = displayName;
  }

  @action public setEmail = (email: string): void => {
    this.email = email;
  }

  @action public setUsername = (username: string): void => {
    this.username = username;
  }

  @action public setAccountDetails = (account: IAccountInfoObject): void => {
    const { activated, displayName, email, username } = account;

    this.activated = activated;
    this.displayName = displayName;
    this.email = email;
    this.username = username;
  }

  /**
   * This method sends a POST request to {@code /account/:username}, with a
   * user's current password (entered by the user) and a new password, to
   * request for a password change.
   * @param {string} password The user's current password.
   * @param {string} newPassword The new password to change to.
   * @returns {Promise<any>} A promise that resolves to an object that
   *     implements the {@code IAccountInfoObject} interface on successful
   *     password change, and an object that has the {@code error} property set
   *     to {@code true} (as well as other properties for displaying error
   *     messages) otherwise.
   */
  @action public updatePassword = (password: string, newPassword: string):
      Promise<any> =>
  {
    console.warn('fetch options need to be revised.');

    const endpoint = `${host}/accounts/${this.username}`;
    const options = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, newPassword })
    };

    this.setFetching(true);

    return (
      fetch(endpoint, options)
        .then((response) => (this.setFetching(false), response.json()))
        .catch((error) => (
          this.setFetching(false),
          console.log(`Account info edit error: ${error}`)
        ))
    );
  }

  /**
   * This method sends a POST request to {@code /account/:username}, with a
   * user's displayName, e-mail address and/or username to be changed to.
   * @param {IUpdatedAccountInfoObject} accountInfo An object that contains
   *     a user's (edited) displayName, e-mail address and/or username.
   * @returns {Promise<any>} A promise that resolves to an object that
   *     implements the {@code IAccountInfoObject} interface on successful
   *     password change, and an object that has the {@code error} property set
   *     to {@code true} (as well as other properties for displaying error
   *     messages) otherwise.
   */
  @action public updateAccountInfo = (accountInfo: IUpdatedAccountInfoObject):
      Promise<any> =>
  {
    console.warn('fetch options need to be revised.');

    const endpoint = `${host}/accounts/${this.username}`;
    const options = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accountInfo)
    };

    this.setFetching(true);

    return (
      fetch(endpoint, options)
        .then((response) => (this.setFetching(false), response.json()))
        .then((account) => (
          !account.error && this.setAccountDetails(account), account
        ))
        .catch((error) => (
          this.setFetching(false),
          console.log(`Account info edit error: ${error}`)
        ))
    );
  }

  /**
   * This method requests a user's account information from the server using
   * a given username and initialises the store with the account information
   * received accordingly.
   * @param {string} authStoreUsername An authenticated user's username. It is
   *     worth noting that, as indicated by the identifier of the parameter,
   *     the username is obtained from {@code authStore}.
   */
  @action public initialise = (authStoreUsername: string): void => {
    console.warn('fetch options need to be revised.');

    const endpoint = `${host}/accounts/${authStoreUsername}`;
    const options = { method: 'GET' };

    this.setFetching(true);

    fetch(endpoint, options)
      .then((response) => (this.setFetching(false), response.json()))
      .then((account) => (
        !account.error && this.setAccountDetails(account), account
      ))
      .catch((error) => (
        this.setFetching(false),
        console.log(`Account info fetch error: ${error}`)
      ));
  };
}

const settingsStore = new SettingsStore();

export default settingsStore;
