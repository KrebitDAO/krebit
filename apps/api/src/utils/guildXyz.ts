import { guild, role, user } from '@guildxyz/sdk';

const getGuild = async (guildId: string) => {
  return await guild.get(guildId);
};

const getRole = async (roleId: number) => {
  return await role.get(roleId);
};

const getAddressGuilds = async (userAddress: string) => {
  const memberships = await user.getMemberships(userAddress);
  const result = await Promise.all(
    memberships.map(async m => {
      const guildInfo = await guild.get(m.guildId);

      return {
        text: guildInfo.name,
        value: m.guildId
      };
    })
  );
  return result;
};

const getAddressRoles = async (guildId: number, userAddress: string) => {
  const memberships = await user.getMemberships(userAddress);
  let result = [];
  for (const m of memberships) {
    if (m.guildId === guildId) {
      const roles = await Promise.all(
        m.roleids.map(async r => {
          const roleInfo = await role.get(r);
          return {
            text: roleInfo.name,
            value: r
          };
        })
      );
      result.concat(roles);
    }
  }
  return result;
};

const getGuildRoles = async (guildId: number, userAddress: string) => {
  const roles = await guild.getUserMemberships(guildId, userAddress);
  const actives = roles.filter(r => {
    return r.access ? true : false;
  });
};

export const guildXyz = {
  getGuild,
  getGuildRoles,
  getAddressGuilds,
  getAddressRoles
};
