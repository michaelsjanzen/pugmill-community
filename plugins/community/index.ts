import type { PugmillPlugin } from "../../src/lib/plugin-registry";
import CommunityAdminPage from "./AdminPage";

export const communityPlugin: PugmillPlugin = {
  id: "community",
  name: "Pugmill Community",
  version: "0.1.0",
  description: "Recipe registry for plugins, themes, workflows, and PNA cartridges.",
  adminPage: CommunityAdminPage,
  initialize(hooks, settings) {
    // Hook listeners will be registered here as features are built
  },
};
