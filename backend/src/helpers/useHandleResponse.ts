import { type Response } from 'express';
import { UniqueConstraintError } from 'sequelize';

type IRespReasons =
  // Tokens
  | 'TokenMissing'
  | 'TokenInvalid'
  | 'RefreshTokenNotFound'
  | 'RefreshTokenExpired'
  | 'RefreshTokenWrong'
  // Users
  | 'UserExists'
  | 'UserNotFound'
  | 'UserNotAuthorized'
  | 'UserBlocked'
  // Roles
  | 'RoleNotFound'
  // General
  | 'NoIdProvided'
  | 'NotFound'
  | 'IncorrectBody';

const useHandleResponse = () => {
  const handleError = ({ e, res }: { e: unknown; res: Response }): void => {
    if (e instanceof UniqueConstraintError) {
      res.status(409).send({ message: e.parent.message }).end();
    } else if (e instanceof Error) {
      res.status(500).send({ message: e.message }).end();
    } else {
      res.status(500).send(e).end();
    }
  };

  const sendCustomResponse = ({
    reason,
    message,
    respCode,
    res,
  }: {
    reason: IRespReasons;
    message: string;
    respCode: number;
    res: Response;
  }): void => {
    res.status(respCode).json({
      reason,
      message,
    });
  };

  return { handleError, sendCustomResponse };
};

export default useHandleResponse;
