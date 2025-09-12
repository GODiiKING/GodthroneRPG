import k from "../kaplayCtx";
import gameStateManager from "../state/gameStateManager";
import playerStatsManager from "../state/playerStatsManager";
import makeActionMenu from "../ui/actionMenu";
import makeBattleField from "../ui/battlefield";
import makeItemsMenu from "../ui/itemsMenu";
import makeStatBox from "../ui/statBox";
import makeTextBox from "../ui/textBox";
import {
  applyAttackEffect,
  applyIllnessDamageEffect,
  applyItemBuffEffect,
  applyItemCureEffect,
  applyItemDebuffEffect,
  applyItemHarmEffect,
  applyItemHealEffect,
  applyItemIllnessEffect,
} from "./effects";

export default function makeBattleSystem(player, enemy) {
  gameStateManager.set("isInBattle", true);

  const battleState = k.add([
    k.state("battle-start", [
      "battle-start",
      "enemy-appearance",
      "player-turn",
      "attack-action",
      "items-action",
      "flee-action",
      "enemy-turn",
      "fled",
      "victory",
      "defeat",
    ]),
  ]);

  const battlefield = makeBattleField(
    enemy.name,
    enemy.sprite,
    enemy.backgroundShader
  );
  const textBox = makeTextBox();
  const statBox = makeStatBox();
  const actionMenu = makeActionMenu();
  actionMenu.setControls();

  let itemsMenu = makeItemsMenu(gameStateManager.current().inventory);

  battleState.onStateEnter("battle-start", () => {
    battlefield.activate();
    textBox.activate();
    statBox.activate();
    battleState.enterState("enemy-appearance");
  });

  battleState.onStateEnter("enemy-appearance", async () => {
    await k.wait(1);
    await textBox.displayLine(`${enemy.name} appears!`);
    battleState.enterState("player-turn");
  });

  battleState.onStateEnter("player-turn", async (flags) => {
    if (!actionMenu.isActive) {
      actionMenu.activate();
      actionMenu.enableControls();
    }

    if (player.stats.illness.type && !flags?.cancelIllnessEffect) {
      await applyIllnessDamageEffect(textBox, player);
    }

    if (player.stats.health === 0) {
      battleState.enterState("defeat");
      return;
    }
  });

  battleState.onStateUpdate("player-turn", async () => {
    if (!k.isButtonPressed("confirm")) return;

    if (actionMenu.state === "attack") {
      battleState.enterState("attack-action");
      return;
    }

    if (
      actionMenu.state === "items" &&
      gameStateManager.current().inventory.length === 0
    ) {
      await textBox.displayLine("No items left in inventory!");
      return;
    }

    if (actionMenu.state === "items") {
      battleState.enterState("items-action");
      return;
    }

    battleState.enterState("flee-action");
  });

  battleState.onStateEnter("attack-action", async () => {
    actionMenu.deactivate();
    await textBox.displayLine(`${player.name} attacks!`);
    await enemy.shake();
    await applyAttackEffect(textBox, player, enemy);
    battleState.enterState("enemy-turn");
  });

  battleState.onStateEnter("items-action", () => {
    actionMenu.disableControls();
    itemsMenu.activate();
  });

  battleState.onStateUpdate("items-action", async () => {
    const inventory = gameStateManager.current().inventory;

    if (k.isButtonPressed("left")) {
      itemsMenu.deactivate();
      itemsMenu = makeItemsMenu(inventory);
      actionMenu.enterState("items");
      actionMenu.enableControls();
      battleState.enterState("player-turn", { cancelIllnessEffect: true });
      return;
    }

    if (k.isButtonPressed("confirm")) {
      const selectedItem = inventory.splice(itemsMenu.currentItemIndex, 1)[0];
      gameStateManager.set("inventory", inventory);

      itemsMenu.deactivate();
      itemsMenu = makeItemsMenu(inventory);
      actionMenu.deactivate();

      await textBox.displayLine(`${player.name} used ${selectedItem.name}!`);
      if (selectedItem.effect === "heal") {
        await applyItemHealEffect(textBox, player, selectedItem);
      }

      if (selectedItem.effect === "harm") {
        await applyItemHarmEffect(textBox, enemy, selectedItem);
      }

      if (selectedItem.effect === "analyze") {
        await k.wait(1);
        await textBox.displayLine(
          `${selectedItem.name} revealed ${enemy.name}'s stats.`
        );
        await k.wait(1);
        await textBox.displayLine(
          `${enemy.name}'s health: ${enemy.stats.health}.`
        );
        await k.wait(0.2);
        await textBox.displayLine(
          `${enemy.name}'s attack: ${enemy.stats.attack}.`
        );
        await k.wait(0.2);
        await textBox.displayLine(
          `${enemy.name}'s defense: ${enemy.stats.defense}.`
        );
      }

      if (selectedItem.effect === "debuff") {
        await applyItemDebuffEffect(textBox, enemy, selectedItem);
      }

      if (selectedItem.effect === "buff") {
        await applyItemBuffEffect(textBox, player, selectedItem);
      }

      if (selectedItem.effect === "illness") {
        await applyItemIllnessEffect(textBox, enemy, selectedItem);
      }

      if (selectedItem.effect === "cure") {
        await applyItemCureEffect(textBox, player, selectedItem);
      }

      await k.wait(1);
      battleState.enterState("enemy-turn");
    }
  });

  battleState.onStateEnter("flee-action", async () => {
    await textBox.displayLine(`${player.name} attempted to flee!`);

    const canFlee =
      enemy.stats.health < enemy.stats.maxHealth / 3 || k.rand(0, 1) < 0.5;

    if (canFlee) {
      await textBox.displayLine(`${player.name} fled successfully!`);
      battleState.enterState("fled");
      return;
    }

    await textBox.displayLine(`${player.name}'s attempt failed!`);
    battleState.enterState("enemy-turn");
  });

  battleState.onStateEnter("enemy-turn", async () => {
    if (enemy.stats.illness.type) {
      await applyIllnessDamageEffect(textBox, enemy);
      await enemy.shake();
    }

    if (enemy.stats.health === 0) {
      await enemy.dropDown();
      await textBox.displayLine(`${enemy.name} fainted!`);
      battleState.enterState("victory");
      return;
    }

    let itemWasUsed = false;
    const removeItemFromInventory = (index) => {
      enemy.items.splice(index, 1);
      itemWasUsed = true;
    };

    if (enemy.items.length > 0) {
      for (const [index, selectedItem] of Object.entries(enemy.items)) {
        if (
          selectedItem.effect === "cure" &&
          enemy.stats.illness.type === selectedItem.type
        ) {
          await textBox.displayLine(`${enemy.name} used ${selectedItem.name}!`);
          await applyItemCureEffect(textBox, enemy, selectedItem);
          removeItemFromInventory(index);
          break;
        }

        if (
          selectedItem.effect === "heal" &&
          enemy.stats.health < enemy.stats.maxHealth / 2
        ) {
          await textBox.displayLine(`${enemy.name} used ${selectedItem.name}!`);
          await applyItemHealEffect(textBox, enemy, selectedItem);
          removeItemFromInventory(index);
          break;
        }

        if (selectedItem.effect === "harm") {
          await textBox.displayLine(`${enemy.name} used ${selectedItem.name}!`);
          await applyItemHarmEffect(textBox, player, selectedItem);
          removeItemFromInventory(index);
          break;
        }

        if (selectedItem.effect === "illness") {
          await textBox.displayLine(`${enemy.name} used ${selectedItem.name}!`);
          await applyItemIllnessEffect(textBox, player, selectedItem);
          removeItemFromInventory(index);
          break;
        }

        if (selectedItem.effect === "buff") {
          await textBox.displayLine(`${enemy.name} used ${selectedItem.name}!`);
          await applyItemBuffEffect(textBox, enemy, selectedItem);
          removeItemFromInventory(index);
          break;
        }

        if (selectedItem.effect === "debuff") {
          await textBox.displayLine(`${enemy.name} used ${selectedItem.name}!`);
          await applyItemDebuffEffect(textBox, player, selectedItem);
          removeItemFromInventory(index);
          break;
        }
      }
    }

    if (!itemWasUsed) {
      await textBox.displayLine(`${enemy.name} attacked!`);
      await applyAttackEffect(textBox, enemy, player);
    }

    await k.wait(1);
    battleState.enterState("player-turn");
  });

  const deactivateUI = () => {
    battlefield.deactivate();
    textBox.deactivate();
    actionMenu.deactivate();
    statBox.deactivate();
  };

  const resetPlayerStats = () => {
    const playerStats = playerStatsManager.current();
    player.stats.attack = playerStats.attack;
    player.stats.defense = playerStats.defense;
  };

  battleState.onStateEnter("victory", async () => {
    await textBox.displayLine(`${player.name} won!`);

    player.stats.exp += enemy.stats.exp;

    await textBox.displayLine(`${player.name} earned ${enemy.stats.exp} exp!`);
    k.destroy(enemy);
    deactivateUI();
    resetPlayerStats();
    gameStateManager.set("isInBattle", false);
  });

  battleState.onStateEnter("defeat", async () => {
    await textBox.displayLine(`${player.name} fainted!`);
    await textBox.displayLine(`${player.name} lost the battle!`);
    // resetPlayerStats();
    gameStateManager.set("isInBattle", false);
    await k.wait(1);
    k.go("gameover");
  });

  battleState.onStateEnter("fled", () => {
    deactivateUI();
    resetPlayerStats();
    gameStateManager.set("isInBattle", false);
  });
}
