import { action, configure, observable } from 'mobx';

configure({ enforceActions: true });

/**
 * This class is used to create a MonX store for components associated with
 * views that deal with settings, which are components that are rendered with
 * paths that begins with {@code /settings}.
 */
class SettingsStore {
  @observable public clearCanvas: () => void;
  @observable public saveCanvas: () => void;

  @action public setClearCanvas = (clearCanvas: () => void): void => {
    this.clearCanvas = clearCanvas;
  }

  @action public setSaveCanvas = (saveCanvas: () => void): void => {
    this.saveCanvas = saveCanvas;
  }
}

const settingsStore = new SettingsStore();

export default settingsStore;
