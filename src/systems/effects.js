import k from "../kaplayCtx";

function reduceHealth(damageDealt, target) {
  if (damageDealt < target.stats.health) {
    target.stats.health -= damageDealt;
    return;
  }

  target.stats.health = 0;
}

export async function applyAttackEffect(textBox, attacker, target) {
  if (target.stats.defense < attacker.stats.attack) {
    const damageDealt = attacker.stats.attack - target.stats.defense;
    reduceHealth(damageDealt, target);
    await textBox.displayLine(
      `${target.name} received ${damageDealt} pts of damage!`
    );
    return;
  }

  await textBox.displayLine(
    `${target.name} defense is too strong! Attack deflected!`
  );
}

export async function applyItemHarmEffect(textBox, target, item) {
  if (target.stats.defense < item.value) {
    const damageDealt = item.value - target.stats.defense;
    reduceHealth(damageDealt, target);
    if (target.type === "enemy") await target.shake();
    await textBox.displayLine(
      `${target.name} received ${damageDealt} pts of damage!`
    );

    return;
  }

  await textBox.displayLine(
    `${target.name} defense is too strong! Attack deflected!`
  );
}

export async function applyItemHealEffect(textBox, target, item) {
  const resultingHealth = target.stats.health + item.value;

  if (resultingHealth > target.stats.maxHealth) {
    target.stats.health = target.stats.maxHealth;
    await textBox.displayLine(`${target.name}'s health was maxed out!`);
    return;
  }

  target.stats.health = resultingHealth;
  await textBox.displayLine(
    `${target.name}'s health increased by ${item.value}!`
  );
}

export async function applyItemIllnessEffect(textBox, target, item) {
  const isIll = k.rand(0, 1) < item.rate;

  if (isIll) {
    target.stats.illness.type = item.type;
    target.stats.illness.recurringDamage = item.value;
    await textBox.displayLine(
      `${target.name}'s got an illness through contact with ${target.stats.illness.type}.`
    );
    return;
  }

  await textBox.displayLine(`${item.name} was ineffective!`);
}

export async function applyIllnessDamageEffect(textBox, target) {
  let resultingHealth =
    target.stats.health - target.stats.illness.recurringDamage;
  if (resultingHealth < 0) resultingHealth = 0;
  target.stats.health = resultingHealth;
  await textBox.displayLine(
    `${target.name} is hurt by ${target.stats.illness.type}.`
  );
  await textBox.displayLine(
    `${target.name}'s health was reduced by ${target.stats.illness.recurringDamage}!`
  );
}

export async function applyItemCureEffect(textBox, target, item) {
  if (target.stats.illness.type !== item.type) {
    await textBox.displayLine(`${item.name} had no effect!`);
    return;
  }

  target.stats.illness.type = null;
  target.stats.illness.recurringDamage = 0;

  await textBox.displayLine(`${target.name} healed from ${item.type} illness!`);
}

export async function applyItemBuffEffect(textBox, target, item) {
  const resultingStatValue = target.stats[item.targetStat] + item.value;

  target.stats[item.targetStat] = resultingStatValue;

  await textBox.displayLine(
    `${target.name}'s ${item.targetStat} was increased by ${item.value}.`
  );
}

export async function applyItemDebuffEffect(textBox, target, item) {
  const resultingStatValue = target.stats[item.targetStat] - item.value;

  target.stats[item.targetStat] =
    resultingStatValue >= 0 ? resultingStatValue : 0;

  await textBox.displayLine(
    `${target.name}'s ${item.targetStat} was decreased by ${item.value}.`
  );
}
