/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Param, HttpException, HttpStatus, Req } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// FIXME: 別ファイルに定義すべき
interface RequestWithUser extends Request {
  user: string; // passportによって、FirebaseAuthのuidが格納される。
}

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @UseGuards(AuthGuard('bearer'))
  @Post('link')
  async linkClientsToCategories(
    @Req() req: RequestWithUser,
    @Body() clientIdsAndCategoryIds: { clientIds: number[]; categoryIds: number[] },
  ) {
    try {
      const uid = req.user;
      // これでいいのか？
      // クライアントがログインユーザーに属しているかを確認
      const clients = await this.clientsService.getClientsByIdsAndUserId(clientIdsAndCategoryIds.clientIds, uid);
      if (clients.length !== clientIdsAndCategoryIds.clientIds.length) {
        throw new HttpException('Some clients do not belong to the authenticated user', HttpStatus.FORBIDDEN);
      }
      // カテゴリーがログインユーザーに属しているかを確認
      const categories = await this.clientsService.getCategoriesByIdsAndUserId(clientIdsAndCategoryIds.categoryIds, uid);
      if (categories.length !== clientIdsAndCategoryIds.categoryIds.length) {
        throw new HttpException('Some categories do not belong to the authenticated user', HttpStatus.FORBIDDEN);
      }

      await this.clientsService.linkClientsToCategories(clientIdsAndCategoryIds.clientIds, clientIdsAndCategoryIds.categoryIds);
      return { message: 'Categories linked to clients successfully' };
    } catch (error) {
      throw new HttpException('Failed to link clients to categories', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('bearer'))
  @Post('unlink')
  async unlinkClientsFromCategories(
    @Req() req: RequestWithUser,
    @Body() clientIdsAndCategoryIds: { clientIds: number[]; categoryIds: number[] },
  ) {
    try {
      const uid = req.user;
      // これでいいのか？
      // クライアントがログインユーザーに属しているかを確認
      const clients = await this.clientsService.getClientsByIdsAndUserId(clientIdsAndCategoryIds.clientIds, uid);
      if (clients.length !== clientIdsAndCategoryIds.clientIds.length) {
        throw new HttpException('Some clients do not belong to the authenticated user', HttpStatus.FORBIDDEN);
      }
      // カテゴリーがログインユーザーに属しているかを確認
      const categories = await this.clientsService.getCategoriesByIdsAndUserId(clientIdsAndCategoryIds.categoryIds, uid);
      if (categories.length !== clientIdsAndCategoryIds.categoryIds.length) {
        throw new HttpException('Some categories do not belong to the authenticated user', HttpStatus.FORBIDDEN);
      }

      await this.clientsService.unlinkClientsFromCategories(clientIdsAndCategoryIds.clientIds, clientIdsAndCategoryIds.categoryIds);
      return { message: 'Categories unlinked from clients successfully' };
    } catch (error) {
      throw new HttpException('Failed to unlink clients from categories', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
