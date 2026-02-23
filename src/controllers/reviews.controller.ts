import { Request, Response } from "express";
import { reviewsService } from "../services/reviews.service";

export const reviewsController = {
    async get(req: Request, res: Response){
        const {eventId} = req.params

        const review = await reviewsService.get(eventId as string)

        res.status(200).json({
            success: true,
            message: "Get review success",
            data: review
        })
    },

    async create(req: Request, res: Response){
        const {eventId, userId, feedback, rating} = req.body

        const review = await reviewsService.create({
          eventId,
          userId, 
          feedback,
          rating,
        });

        res.status(201).json({
            success: true,
            message: "Create review success",
            data: review
        })
    },

    async delete(req: Request, res: Response){
        const {id} = req.params

        const review = reviewsService.delete(id as string)

        res.status(200).json({
            success: true,
            message: "Delete review success",
            data: review
        })
    }
}